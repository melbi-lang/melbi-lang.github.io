#!/usr/bin/env python3
"""Format melbi code blocks in markdown files."""

import argparse
import difflib
import re
import subprocess
import sys


def format_melbi(code: str) -> str:
    result = subprocess.run(
        ["melbi-fmt", "-s"],
        input=code,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(
            f"melbi-fmt error: {result.stderr.strip()}\nOn:\n{code}\n", file=sys.stderr
        )
        return code
    return result.stdout


def process_markdown(content: str) -> str:
    # Match opening fence indent, but accept any indent on closing fence
    pattern = r"(^([ \t]*)```melbi\n)(.*?)(^[ \t]*```)"

    def replacer(match):
        fence_start, indent, code, _ = match.groups()

        # Strip indentation from code
        if indent:
            code = re.sub(f"^{indent}", "", code, flags=re.MULTILINE)

        formatted = format_melbi(code)

        # Re-add indentation to formatted code
        if indent:
            formatted = re.sub("^", indent, formatted, flags=re.MULTILINE)

        # Closing fence gets corrected to match opening
        fence_end = "```"

        return f"{fence_start}{formatted}{fence_end}"

    return re.sub(pattern, replacer, content, flags=re.DOTALL | re.MULTILINE)


def show_diff(path: str, original: str, formatted: str) -> bool:
    """Print unified diff. Returns True if there were changes."""
    if original == formatted:
        return False

    diff = difflib.unified_diff(
        original.splitlines(keepends=True),
        formatted.splitlines(keepends=True),
        fromfile=f"a/{path}",
        tofile=f"b/{path}",
    )
    sys.stdout.writelines(diff)
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("files", nargs="+", help="Markdown files to process")
    parser.add_argument(
        "-w", "--write", action="store_true", help="Write changes in-place"
    )
    args = parser.parse_args()

    changed = 0
    for path in args.files:
        with open(path) as f:
            original = f.read()

        formatted = process_markdown(original)

        if args.write:
            if original != formatted:
                with open(path, "w") as f:
                    f.write(formatted)
                print(f"Formatted {path}")
                changed += 1
        else:
            if show_diff(path, original, formatted):
                changed += 1

    sys.exit(1 if changed and not args.write else 0)


if __name__ == "__main__":
    main()
