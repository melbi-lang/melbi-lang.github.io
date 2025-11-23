import { Parser, Language } from "https://cdn.jsdelivr.net/npm/web-tree-sitter@0.25.10/tree-sitter.js";
import * as monaco from "https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/+esm";
import init, { PlaygroundEngine } from "/playground/wasm/playground_worker.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const NODE_SCOPE_MAP = {
  comment: "comment.line.melbi",
  boolean: "constant.language.boolean.melbi",
  integer: "constant.numeric.integer.melbi",
  float: "constant.numeric.float.melbi",
  string: "string.quoted.double.melbi",
  bytes: "string.quoted.double.bytes.melbi",
  format_string: "string.quoted.double.format.melbi",
  identifier: "variable.other.melbi",
  quoted_identifier: "variable.other.quoted.melbi",
  unquoted_identifier: "variable.other.melbi",
  type_path: "entity.name.type.melbi"
};
const DEFAULT_SCOPE = "source.melbi";
const COMPLETION_KIND_MAP = {
  function: "Function",
  variable: "Variable",
  keyword: "Keyword",
  snippet: "Snippet",
  text: "Text"
};
class MelbiTokenState {
  constructor(lineNumber = 0, version = 0) {
    this.lineNumber = lineNumber;
    this.version = version;
  }
  clone() {
    return new MelbiTokenState(this.lineNumber, this.version);
  }
  equals(other) {
    return !!other && this.lineNumber === other.lineNumber && this.version === other.version;
  }
}
function computeNewEndPosition(range, text) {
  const startRow = range.startLineNumber - 1;
  const startColumn = range.startColumn - 1;
  if (!text) {
    return { row: startRow, column: startColumn };
  }
  const lines = text.split("\n");
  if (lines.length === 1) {
    return { row: startRow, column: startColumn + lines[0].length };
  }
  return { row: startRow + lines.length - 1, column: lines[lines.length - 1].length };
}
function createEmptyTokenLines(model, defaultScope = DEFAULT_SCOPE) {
  const lineCount = typeof model?.getLineCount === "function" ? model.getLineCount() : 0;
  return Array.from({ length: lineCount }, () => [{ startIndex: 0, scopes: defaultScope }]);
}
function pushTokenRange(node, scope, lineMap, model, defaultScope = DEFAULT_SCOPE) {
  const start = node.startPosition;
  const end = node.endPosition;
  for (let row = start.row; row <= end.row; row += 1) {
    const tokens = lineMap[row];
    if (!tokens) {
      continue;
    }
    const startColumn = row === start.row ? start.column : 0;
    const endColumn = row === end.row ? end.column : model.getLineLength(row + 1);
    if (startColumn === endColumn) {
      continue;
    }
    tokens.push({ startIndex: startColumn, scopes: scope });
    tokens.push({ startIndex: endColumn, scopes: defaultScope });
  }
}
function buildTokensFromTree(tree, model, scopeMap = NODE_SCOPE_MAP, defaultScope = DEFAULT_SCOPE) {
  const tokenLines = createEmptyTokenLines(model, defaultScope);
  if (!tree?.rootNode || !model) {
    return tokenLines;
  }
  const stack = [tree.rootNode];
  while (stack.length) {
    const node = stack.pop();
    if (!node) {
      continue;
    }
    const scope = scopeMap[node.type];
    if (scope) {
      pushTokenRange(node, scope, tokenLines, model, defaultScope);
    }
    if (Array.isArray(node.namedChildren)) {
      for (const child of node.namedChildren) {
        stack.push(child);
      }
    }
  }
  return tokenLines.map((lineTokens) => lineTokens.sort((a, b) => a.startIndex - b.startIndex));
}
function spanToRange(model, span) {
  if (!span) {
    const position = model.getPositionAt(0);
    return {
      startLineNumber: position.lineNumber,
      startColumn: position.column,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    };
  }
  const start = model.getPositionAt(span.start ?? 0);
  const end = model.getPositionAt(span.end ?? span.start ?? 0);
  return {
    startLineNumber: start.lineNumber,
    startColumn: start.column,
    endLineNumber: end.lineNumber,
    endColumn: end.column
  };
}
function tsPointToOffset(model, point) {
  return model.getOffsetAt({ lineNumber: point.row + 1, column: point.column + 1 });
}
function nodeToSpan(model, node) {
  const startIndex = tsPointToOffset(model, node.startPosition);
  const endIndex = tsPointToOffset(model, node.endPosition);
  if (startIndex === endIndex) {
    const fallbackEnd = Math.min(startIndex + 1, model.getValueLength());
    return { start: startIndex, end: fallbackEnd };
  }
  return { start: startIndex, end: endIndex };
}
function collectSyntaxDiagnostics(tree, model) {
  if (!tree?.rootNode || !model) {
    return [];
  }
  const diagnostics = [];
  const stack = [tree.rootNode];
  while (stack.length) {
    const node = stack.pop();
    if (!node) {
      continue;
    }
    if (typeof node.isMissing === "function" && node.isMissing()) {
      diagnostics.push({
        message: `Missing ${node.type}`,
        severity: "error",
        code: "missing",
        span: nodeToSpan(model, node),
        source: "parser"
      });
    } else if (typeof node.isError === "function" && node.isError() && !(node.parent && typeof node.parent.isError === "function" && node.parent.isError())) {
      diagnostics.push({
        message: "Syntax error",
        severity: "error",
        code: "syntax",
        span: nodeToSpan(model, node),
        source: "parser"
      });
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        stack.push(child);
      }
    }
  }
  diagnostics.sort((a, b) => (a.span?.start ?? 0) - (b.span?.start ?? 0));
  return diagnostics;
}
function mapCompletionItem(monaco2, model, position, item, kindMap = COMPLETION_KIND_MAP) {
  const word = model.getWordUntilPosition(position);
  const range = new monaco2.Range(
    position.lineNumber,
    word.startColumn,
    position.lineNumber,
    word.endColumn
  );
  const kindKey = (item.kind || item.type || "text").toString().toLowerCase();
  const kindName = kindMap[kindKey] || kindMap.text;
  const kind = monaco2.languages.CompletionItemKind[kindName] || monaco2.languages.CompletionItemKind.Text;
  const insertText = item.insert_text || item.snippet || item.text || item.label || "";
  const isSnippet = Boolean(item.snippet || item.is_snippet);
  const insertTextRules = isSnippet ? monaco2.languages.CompletionItemInsertTextRule.InsertAsSnippet : void 0;
  return {
    label: item.label || item.text || insertText,
    kind,
    detail: item.detail || item.documentation,
    documentation: item.documentation,
    insertText,
    insertTextRules,
    range
  };
}
function applyEditsToTree(tree, changes, computeFn = computeNewEndPosition) {
  if (!tree || !Array.isArray(changes) || changes.length === 0) {
    return;
  }
  const ordered = [...changes].sort((a, b) => a.rangeOffset - b.rangeOffset);
  for (const change of ordered) {
    tree.edit({
      startIndex: change.rangeOffset,
      oldEndIndex: change.rangeOffset + change.rangeLength,
      newEndIndex: change.rangeOffset + change.text.length,
      startPosition: {
        row: change.range.startLineNumber - 1,
        column: change.range.startColumn - 1
      },
      oldEndPosition: {
        row: change.range.endLineNumber - 1,
        column: change.range.endColumn - 1
      },
      newEndPosition: computeFn(change.range, change.text)
    });
  }
}
const MONACO_CDN = "https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/esm";
self.MonacoEnvironment = {
  getWorkerUrl() {
    const proxy = `
      self.MonacoEnvironment = { baseUrl: '${MONACO_CDN}/' };
    `;
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(proxy)}`;
  }
};
const TREE_SITTER_WASM_URL = "/playground/wasm/tree-sitter-melbi.wasm";
const LANGUAGE_CONFIG_URL = "/playground/assets/language-configuration.json";
const DEFAULT_SOURCE = "1 + 1";
const MARKER_OWNER = "melbi-playground";
const AUTO_RUN_DEBOUNCE_MS = 250;
const state = {
  _initialized: false,
  editor: null,
  monacoApi: null,
  enginePromise: null,
  parserPromise: null,
  parserInstance: null,
  currentTree: null,
  currentTokensByLine: [],
  tokenStateVersion: 0,
  lastWorkerDiagnostics: [],
  lastSyntaxDiagnostics: [],
  dom: {
    editorContainer: null,
    output: null,
    themeToggle: null,
    timing: null
  },
  currentTheme: "light",
  autoRunHandle: null,
  pendingAutoRunAfterInFlight: false,
  inFlightEvaluation: null
};
function getDomRefs() {
  if (typeof document === "undefined") {
    return state.dom;
  }
  return {
    editorContainer: document.querySelector("#melbi-playground .melbi-editor"),
    output: document.querySelector("#melbi-playground .melbi-output"),
    themeToggle: document.querySelector(
      "#melbi-playground .melbi-theme-toggle"
    ),
    timing: document.querySelector("#melbi-playground .melbi-timing")
  };
}
function renderResponse(payload) {
  if (!state.dom.output) {
    return;
  }
  if (payload.status === "ok") {
    const durationText = payload.data.duration_ms < 0.01 ? "<0.01ms" : `${payload.data.duration_ms.toFixed(2)}ms`;
    state.dom.output.innerHTML = `${payload.data.value} <span class="type">${payload.data.type_name}</span>`;
    if (state.dom.timing) {
      state.dom.timing.textContent = durationText;
    }
    updateDiagnostics([]);
  } else {
    updateDiagnostics(payload.error.diagnostics || []);
  }
}
async function ensureEngine() {
  if (!state.enginePromise) {
    state.enginePromise = (async () => {
      try {
        await init();
        const instance = new PlaygroundEngine();
        try {
          await instance.evaluate("1 + 1");
        } catch (err) {
        }
        return instance;
      } catch (err) {
        console.error(err);
        console.error("Failed to initialize worker");
        throw err;
      }
    })();
  }
  return state.enginePromise;
}
async function ensureParser() {
  if (!state.parserPromise) {
    state.parserPromise = (async () => {
      await Parser.init({
        locateFile(scriptName, scriptDirectory) {
          return `https://cdn.jsdelivr.net/npm/web-tree-sitter@0.25.10/${scriptName}`;
        }
      });
      const language = await Language.load(TREE_SITTER_WASM_URL);
      const parser = new Parser();
      parser.setLanguage(language);
      return parser;
    })();
  }
  return state.parserPromise;
}
function loadMonaco() {
  return Promise.resolve(monaco);
}
async function loadLanguageConfig() {
  try {
    const response = await fetch(LANGUAGE_CONFIG_URL);
    if (!response.ok) {
      throw new Error(`Failed to load language config: ${response.statusText}`);
    }
    const config = await response.json();
    if (config.folding?.markers) {
      if (typeof config.folding.markers.start === "string") {
        config.folding.markers.start = new RegExp(config.folding.markers.start);
      }
      if (typeof config.folding.markers.end === "string") {
        config.folding.markers.end = new RegExp(config.folding.markers.end);
      }
    }
    if (config.wordPattern && typeof config.wordPattern === "string") {
      config.wordPattern = new RegExp(config.wordPattern);
    }
    if (config.indentationRules) {
      if (typeof config.indentationRules.increaseIndentPattern === "string") {
        config.indentationRules.increaseIndentPattern = new RegExp(
          config.indentationRules.increaseIndentPattern
        );
      }
      if (typeof config.indentationRules.decreaseIndentPattern === "string") {
        config.indentationRules.decreaseIndentPattern = new RegExp(
          config.indentationRules.decreaseIndentPattern
        );
      }
    }
    return config;
  } catch (err) {
    console.warn("Failed to load language configuration:", err);
    return null;
  }
}
function updateDiagnostics(workerDiagnostics) {
  if (Array.isArray(workerDiagnostics)) {
    state.lastWorkerDiagnostics = workerDiagnostics;
  } else if (workerDiagnostics === null) {
    state.lastWorkerDiagnostics = [];
  }
  if (!state.monacoApi || !state.editor) {
    return;
  }
  const model = state.editor.getModel();
  if (!model) {
    return;
  }
  const combinedDiagnostics = [
    ...state.lastSyntaxDiagnostics,
    ...state.lastWorkerDiagnostics
  ];
  const markers = combinedDiagnostics.map((diag) => {
    const range = spanToRange(model, diag.span);
    const severity = (diag.severity || "").toLowerCase();
    const markerSeverity = severity === "error" ? state.monacoApi.MarkerSeverity.Error : severity === "warning" ? state.monacoApi.MarkerSeverity.Warning : state.monacoApi.MarkerSeverity.Info;
    return {
      ...range,
      message: diag.message,
      severity: markerSeverity,
      code: diag.code,
      source: diag.source || "melbi"
    };
  });
  state.monacoApi.editor.setModelMarkers(model, MARKER_OWNER, markers);
}
async function getHoverFromWorker(model, position) {
  const offset = model.getOffsetAt(position);
  const response = await callWorkerMethod(
    ["hover_at_position", "hover_at", "hover"],
    model.getValue(),
    offset
  );
  if (!response || response.status !== "ok") {
    return null;
  }
  const contents = response.data?.contents || response.data?.text || response.data?.value;
  if (!contents) {
    return null;
  }
  const range = response.data?.span ? spanToRange(model, response.data.span) : null;
  return {
    contents: [{ value: contents }],
    range
  };
}
async function getCompletionsFromWorker(model, position) {
  const offset = model.getOffsetAt(position);
  const response = await callWorkerMethod(
    [
      "completions_at_position",
      "completions_at",
      "completion_items",
      "complete"
    ],
    model.getValue(),
    offset
  );
  if (!response || response.status !== "ok") {
    return [];
  }
  const suggestions = response.data?.items || response.data?.suggestions || [];
  return suggestions;
}
async function callWorkerMethod(methodNames, ...args) {
  const engine = await ensureEngine();
  const names = Array.isArray(methodNames) ? methodNames : [methodNames];
  for (const name of names) {
    const fn = engine?.[name];
    if (typeof fn === "function") {
      try {
        return await fn.apply(engine, args);
      } catch (err) {
        console.error(`Worker method ${name} failed`, err);
      }
    }
  }
  return null;
}
function registerLanguageProviders(monaco2, languageConfig) {
  monaco2.languages.register({ id: "melbi" });
  if (languageConfig) {
    monaco2.languages.setLanguageConfiguration("melbi", languageConfig);
  }
  monaco2.languages.setTokensProvider("melbi", createTokensProvider());
  monaco2.languages.registerHoverProvider("melbi", {
    provideHover: async (model, position) => {
      try {
        return await getHoverFromWorker(model, position);
      } catch (err) {
        console.error("Hover provider failed", err);
        return null;
      }
    }
  });
  monaco2.languages.registerCompletionItemProvider("melbi", {
    triggerCharacters: [" ", ".", ":", "("],
    provideCompletionItems: async (model, position) => {
      try {
        const workerItems = await getCompletionsFromWorker(model, position);
        const suggestions = workerItems.map(
          (item) => mapCompletionItem(monaco2, model, position, item, COMPLETION_KIND_MAP)
        );
        return { suggestions };
      } catch (err) {
        console.error("Completion provider failed", err);
        return { suggestions: [] };
      }
    }
  });
}
function createTokensProvider() {
  return {
    getInitialState: () => new MelbiTokenState(0, state.tokenStateVersion),
    tokenize: (_line, tokenState) => {
      const lineIndex = tokenState.lineNumber;
      const lineTokens = state.currentTokensByLine[lineIndex] || [];
      return {
        tokens: lineTokens.map((token) => ({
          startIndex: token.startIndex,
          scopes: token.scopes
        })),
        endState: new MelbiTokenState(lineIndex + 1, state.tokenStateVersion)
      };
    }
  };
}
function updateEditorHeight() {
  if (!state.editor || !state.dom.editorContainer) {
    return;
  }
  const model = state.editor.getModel();
  if (!model) {
    return;
  }
  const lineCount = model.getLineCount();
  const lineHeight = state.editor.getOption(
    state.monacoApi.editor.EditorOption.lineHeight
  );
  const padding = 16;
  state.dom.editorContainer.style.height;
  state.editor.getContentHeight();
  const maxHeight = 400;
  const idealHeight = lineCount * lineHeight + padding;
  const newHeight = Math.max(
    lineHeight + padding,
    Math.min(maxHeight, idealHeight)
  );
  const isAtMaxHeight = idealHeight >= maxHeight;
  state.dom.editorContainer.style.height = `${newHeight}px`;
  state.editor.updateOptions({
    scrollbar: {
      vertical: isAtMaxHeight ? "auto" : "hidden",
      horizontal: "auto",
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8
    }
  });
  const width = state.dom.editorContainer.clientWidth;
  state.editor.layout({ width, height: newHeight });
  if (!isAtMaxHeight) {
    state.editor.setScrollTop(0);
  }
}
function getCSSColor(varName, fallback) {
  if (typeof window === "undefined" || !document.documentElement) {
    console.warn(
      `getCSSColor: window or document.documentElement not available, using fallback for ${varName}`,
      { varName, fallback }
    );
    return fallback;
  }
  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue(varName).trim();
  if (!color) {
    console.warn(
      `getCSSColor: CSS variable not found, using fallback for ${varName}`,
      { varName, fallback, computedStyle: style }
    );
    return fallback;
  }
  return rgbToHex(color);
}
function stripHash(color) {
  return color.startsWith("#") ? color.substring(1) : color;
}
function rgbToHex(rgb) {
  if (rgb.startsWith("#")) {
    return rgb;
  }
  const match = rgb.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
  if (!match) {
    console.warn(`rgbToHex: Unable to parse color "${rgb}"`);
    return rgb;
  }
  const r = Math.round(parseFloat(match[1])).toString(16).padStart(2, "0");
  const g = Math.round(parseFloat(match[2])).toString(16).padStart(2, "0");
  const b = Math.round(parseFloat(match[3])).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}
function getAllSyntaxColorsFromDOM() {
  const lookup = document.getElementById("melbi-syntax-lookup");
  if (!lookup) {
    console.warn(
      "getAllSyntaxColorsFromDOM: #melbi-syntax-lookup element not found"
    );
    return {};
  }
  const code = lookup.querySelector("code");
  if (!code) {
    console.warn(
      "getAllSyntaxColorsFromDOM: <code> element not found in #melbi-syntax-lookup"
    );
    return {};
  }
  const colors = {};
  const spans = code.querySelectorAll("span[class]");
  for (const span of spans) {
    const className = span.className;
    const color = getComputedStyle(span).color;
    if (!color || color === "rgba(0, 0, 0, 0)" || color === "transparent") {
      console.warn(
        `getAllSyntaxColorsFromDOM: No valid color for .${className}`,
        { className, computedColor: color }
      );
      continue;
    }
    colors[className] = rgbToHex(color);
  }
  console.log("getAllSyntaxColorsFromDOM: Extracted colors", colors);
  return colors;
}
function defineMonacoTheme(monaco2) {
  const bgColor = getCSSColor("--melbi-input-background-color", "#f9f9f9");
  const syntaxColors = getAllSyntaxColorsFromDOM();
  const fgColor = syntaxColors.n || "#383942";
  const commentColor = syntaxColors.c || "#9fa0a6";
  const keywordColor = syntaxColors.k || "#a625a4";
  const stringColor = syntaxColors.s || "#50a04f";
  const numberColor = syntaxColors.m || "#986801";
  const typeColor = syntaxColors.kt || "#c18401";
  const variableColor = syntaxColors.nv || "#e45649";
  const tokenRules = [
    {
      token: "comment.line.melbi",
      foreground: stripHash(commentColor),
      fontStyle: "italic"
    },
    {
      token: "constant.language.boolean.melbi",
      foreground: stripHash(keywordColor),
      fontStyle: "bold"
    },
    {
      token: "constant.numeric.integer.melbi",
      foreground: stripHash(numberColor)
    },
    {
      token: "constant.numeric.float.melbi",
      foreground: stripHash(numberColor)
    },
    {
      token: "string.quoted.double.melbi",
      foreground: stripHash(stringColor)
    },
    {
      token: "string.quoted.double.format.melbi",
      foreground: stripHash(stringColor)
    },
    {
      token: "string.quoted.double.bytes.melbi",
      foreground: stripHash(stringColor)
    },
    { token: "entity.name.type.melbi", foreground: stripHash(typeColor) },
    {
      token: "variable.other.quoted.melbi",
      foreground: stripHash(variableColor)
    },
    { token: "variable.other.melbi", foreground: stripHash(fgColor) },
    { token: "source.melbi", foreground: stripHash(fgColor) }
  ];
  monaco2.editor.defineTheme("melbi-jtd", {
    base: "vs",
    inherit: true,
    rules: tokenRules,
    colors: {
      "editor.background": bgColor,
      "editor.foreground": fgColor,
      "editorLineNumber.foreground": stripHash(commentColor),
      "editorLineNumber.activeForeground": stripHash(fgColor)
    }
  });
}
async function setupEditor(monaco2) {
  const languageConfig = await loadLanguageConfig();
  registerLanguageProviders(monaco2, languageConfig);
  defineMonacoTheme(monaco2);
  window.addEventListener("jtd:theme-changed", () => {
    console.log("[Monaco] Theme changed");
    defineMonacoTheme(monaco2);
    if (state.editor) {
      monaco2.editor.setTheme("melbi-jtd");
    }
  });
  state.editor = window.editor = monaco2.editor.create(
    state.dom.editorContainer,
    {
      value: (window.initialCode || "").replace(/\n$/, ""),
      language: "melbi",
      minimap: { enabled: false },
      fontSize: 20,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Consolas', monospace",
      fontLigatures: true,
      theme: "melbi-jtd",
      automaticLayout: false,
      lineNumbers: "off",
      glyphMargin: false,
      folding: false,
      renderLineHighlight: "none",
      scrollbar: {
        vertical: "hidden",
        horizontal: "auto",
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      },
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      scrollBeyondLastLine: false,
      wordWrap: "on",
      fixedOverflowWidgets: true,
      padding: {
        top: 8,
        bottom: 8
      }
    }
  );
  state.editor.onDidChangeModelContent((event) => {
    updateEditorHeight();
    handleModelContentChange(event);
  });
  updateEditorHeight();
  scheduleAutoRun();
}
function handleModelContentChange(event) {
  if (!state.parserInstance || !state.editor) {
    updateDiagnostics();
    scheduleAutoRun();
    return;
  }
  const model = state.editor.getModel();
  if (!model) {
    return;
  }
  if (state.currentTree && event?.changes?.length) {
    applyEditsToTree(state.currentTree, event.changes, computeNewEndPosition);
  }
  const previousTree = state.currentTree;
  state.currentTree = state.parserInstance.parse(
    model.getValue(),
    state.currentTree
  );
  if (previousTree) {
    previousTree.delete();
  }
  updateSyntaxArtifacts(model);
  scheduleAutoRun();
}
function updateSyntaxArtifacts(model) {
  if (!model) {
    state.lastSyntaxDiagnostics = [];
    state.currentTokensByLine = [];
    updateDiagnostics();
    return;
  }
  state.currentTokensByLine = buildTokensFromTree(
    state.currentTree,
    model,
    NODE_SCOPE_MAP,
    DEFAULT_SCOPE
  );
  refreshTokensForModel(model);
  state.lastSyntaxDiagnostics = collectSyntaxDiagnostics(
    state.currentTree,
    model
  );
  updateDiagnostics();
}
function hasBlockingSyntaxErrors() {
  return state.lastSyntaxDiagnostics.some(
    (diag) => (diag?.severity || "error").toLowerCase() === "error"
  );
}
function cancelScheduledAutoRun() {
  if (state.autoRunHandle) {
    clearTimeout(state.autoRunHandle);
    state.autoRunHandle = null;
  }
}
function scheduleAutoRun() {
  if (!state.editor) {
    return;
  }
  if (state.autoRunHandle) {
    clearTimeout(state.autoRunHandle);
  }
  state.autoRunHandle = globalThis.setTimeout(() => {
    state.autoRunHandle = null;
    attemptAutoRun();
  }, AUTO_RUN_DEBOUNCE_MS);
}
function attemptAutoRun() {
  if (state.inFlightEvaluation) {
    state.pendingAutoRunAfterInFlight = true;
    return;
  }
  if (hasBlockingSyntaxErrors()) {
    return;
  }
  runEvaluation({ reason: "auto", skipIfSyntaxErrors: true }).catch((err) => {
    console.warn("Auto-run evaluation failed.", err);
  });
}
async function runEvaluation({
  reason = "manual",
  skipIfSyntaxErrors = false
} = {}) {
  if (!state.editor) {
    return null;
  }
  if (reason === "manual") {
    cancelScheduledAutoRun();
    state.pendingAutoRunAfterInFlight = false;
  }
  if (skipIfSyntaxErrors && hasBlockingSyntaxErrors()) {
    return null;
  }
  if (state.inFlightEvaluation) {
    if (reason === "manual") {
      try {
        await state.inFlightEvaluation;
      } catch (err) {
        console.error("Previous evaluation failed", err);
      }
    } else {
      state.pendingAutoRunAfterInFlight = true;
      return state.inFlightEvaluation;
    }
  }
  const evaluationPromise = (async () => {
    try {
      const engine = await ensureEngine();
      const payload = await engine.evaluate(state.editor.getValue());
      renderResponse(payload);
      return payload;
    } catch (err) {
      console.error(err);
      if (state.dom.output) {
        state.dom.output.textContent = `Evaluation failed: ${err}`;
      }
      console.error("Evaluation failed");
      throw err;
    }
  })();
  state.inFlightEvaluation = evaluationPromise;
  try {
    return await evaluationPromise;
  } finally {
    if (state.inFlightEvaluation === evaluationPromise) {
      state.inFlightEvaluation = null;
    }
    if (state.pendingAutoRunAfterInFlight) {
      state.pendingAutoRunAfterInFlight = false;
      attemptAutoRun();
    }
  }
}
function refreshTokensForModel(model) {
  state.tokenStateVersion += 1;
  if (typeof model?.forceTokenization === "function") {
    model.forceTokenization(model.getLineCount());
  }
}
async function setupParser() {
  try {
    state.parserInstance = await ensureParser();
    const model = state.editor?.getModel();
    if (state.parserInstance && model) {
      if (model.getValue() === "") {
        state.editor.setValue(DEFAULT_SOURCE);
      }
      const previousTree = state.currentTree;
      state.currentTree = state.parserInstance.parse(model.getValue());
      if (previousTree) {
        previousTree.delete();
      }
      updateSyntaxArtifacts(model);
    }
  } catch (err) {
    console.error("Failed to initialize Tree-sitter", err);
  }
}
function toggleTheme() {
  state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
  applyTheme();
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("melbi-theme", state.currentTheme);
  }
}
function applyTheme() {
  const isDark = state.currentTheme === "dark";
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", isDark);
  }
  if (state.monacoApi && state.editor) {
    state.monacoApi.editor.setTheme(isDark ? "melbi-dark" : "melbi-light");
  }
  if (state.dom.themeToggle) {
    state.dom.themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  }
}
function loadThemePreference() {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("melbi-theme");
    if (saved === "dark" || saved === "light") {
      state.currentTheme = saved;
    }
  }
  applyTheme();
}
function attachButtonHandlers() {
  if (state.dom.themeToggle && !state.dom.themeToggle.__melbiBound) {
    state.dom.themeToggle.__melbiBound = true;
    state.dom.themeToggle.addEventListener("click", toggleTheme);
  }
}
async function initializePlayground() {
  if (state._initialized) {
    return;
  }
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }
  state.dom = getDomRefs();
  if (!state.dom.editorContainer || !state.dom.output) {
    console.error("Playground DOM elements missing.");
    return;
  }
  loadThemePreference();
  attachButtonHandlers();
  try {
    state.monacoApi = await loadMonaco();
    await setupEditor(state.monacoApi);
  } catch (err) {
    console.error("Failed to load Monaco", err);
    console.error("Failed to load code editor");
    return;
  }
  await setupParser();
  ensureEngine().catch(() => {
  });
  state._initialized = true;
}
if (typeof window !== "undefined") {
  window.playgroundState = state;
}
if (typeof window !== "undefined" && typeof document !== "undefined") {
  initializePlayground();
}
