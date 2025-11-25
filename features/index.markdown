---
title: Features
layout: default
nav_order: 2
permalink: /features/
---

# Melbi

Melbi is an embeddable expression language designed for safe evaluation of user-defined logic.

## Feature Highlights

* **No runtime errors if it compiles** - Type system guarantees logical errors are handled.
* **Expression-focused** - Everything is an expression. No statements, no surprises.
* **Effect tracking** - Errors propagate automatically through `!` effect. Handle with `otherwise` or pattern matching.
* **Safe sandboxing** - Memory and time limits built-in. Safe for untrusted code.
* **Type inference** - Full Hindley-Milner style inference. No type annotations required.
* **Pattern matching** - Decompose union types and handle errors explicitly.
* **Embeddable anywhere** - Rust-native with C FFI for Python, Node.js, Go, Java, and any language with C bindings.
* **Fast execution** - Arena-based allocation competitive with C++ performance.
* **Rich expressions** - Arrays, records, maps, lambdas, format strings, and where-bindings.

## Use Cases

Email filters, feature flags, A/B testing, ETL transformations, business rules, configuration systems, data validation - anywhere end users need to define logic without modifying your application's source code.

## Project Status

Melbi is in **active alpha development**. The core language features work, but the API and tooling are still evolving. Not recommended for production use yet.
