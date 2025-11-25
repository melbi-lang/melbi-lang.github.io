---
title: Standard Library
layout: tutorial
parent: Functions
nav_order: 4
permalink: /tutorial/functions/standard-library/
code_sample: |
  Math.Sqrt(16.0)
---

# Standard Library
{: .no_toc }

<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

---

Melbi comes with a **standard library** of useful functions organized into packages. You've already seen some of these in action, like `Math.Sqrt` and `Array.Map`.

{: .highlight }
> Detailed reference documentation for the standard library is being developed. This lesson will be expanded with links to the full reference docs when available.

## Available packages

The standard library includes these packages:

| Package | Purpose |
|---------|---------|
| `Math` | Mathematical operations (abs, sqrt, trig, etc.) |
| `String` | String manipulation (trim, upper, lower, etc.) |
| `Array` | Array operations (map, filter, fold, etc.) |
| `Map` | Map/dictionary operations |
| `Option` | Working with optional values |
| `Stats` | Statistical functions (mean, median, etc.) |
| `Regex` | Regular expression matching |
| `Bytes` | Binary data operations |

## Using package functions

Package functions use `UpperCamelCase` naming and are called with dot notation:

```melbi
{
    math = Math.Abs(-42.0),
    string = String.Trim("  hello  "),
    array = Array.Map([1, 2, 3], (x) => x * 2),
}
```

Result: `{ math = 42.0, string = "hello", array = [2, 4, 6] }`

## Domain-specific functions

The application running Melbi may also provide additional functions specific to your use case. These work exactly like standard library functions—same calling syntax, same type safety.

For example, a spreadsheet tool might provide `Cell.Value("A1")`, or a game might provide `Player.GetHealth()`. Check your application's documentation for available functions.

## What's next?

Once the standard library reference is complete, this lesson will include:
- Complete function listings for each package
- Type signatures and examples
- Common patterns and best practices

For now, explore the functions you've seen in this tutorial, and check your application's documentation for any domain-specific functions available to you.
