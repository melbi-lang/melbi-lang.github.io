---
title: Function Calls
layout: tutorial
parent: Functions
nav_order: 2
permalink: /tutorial/functions/function-calls/
code_sample: |
  Math.Sqrt(16) + Math.Abs(-5)
---

# Function Calls
{: .no_toc }

<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

You've learned how to create lambdas—functions you define yourself. But Melbi also provides **built-in functions** from the standard library, and the host application can provide **custom functions** specific to your use case. Let's learn how to work with functions that come from outside your expression.

## Built-in vs Your Functions

There's an important naming convention in Melbi:

- **Capitalized names** (like `Math.Sqrt`) are functions from **packages**—either standard library or provided by the host application
- **Lowercase names** (like `double` or `add`) are typically **your lambdas** defined with `where`

```melbi
result where {
  double = (x) => x * 2,        // Your lambda (lowercase)
  value = Math.Sqrt(16),         // Built-in function (capitalized)
  result = double(value)         // Calling your lambda
}
```

## Calling Package Functions

To call a function from a package, use the package name, a dot, and the function name:

```melbi
Math.Sqrt(16)
```

This calls the `Sqrt` function from the `Math` package with the argument `16`, returning `4.0`.

Functions can take multiple arguments:

```melbi
Math.Pow(2, 8)
```

This raises 2 to the power of 8, returning `256.0`.

## The Math Package

Melbi provides mathematical functions and constants:

**Constants:**
```melbi
constants where {
  pi = Math.PI,           // 3.14159...
  e = Math.E,             // 2.71828...
  tau = Math.TAU,         // 6.28318... (2π)
  constants = [pi, e, tau]
}
```

**Basic operations:**
```melbi
Math.Abs(-42)           // Absolute value → 42.0
Math.Min(5, 3)          // Minimum → 3.0
Math.Max(5, 3)          // Maximum → 5.0
Math.Clamp(10, 0, 5)    // Clamp to range → 5.0
```

**Rounding:**
```melbi
Math.Floor(3.7)         // Round down → 3
Math.Ceil(3.2)          // Round up → 4
Math.Round(3.5)         // Round to nearest → 4
```

**Power and roots:**
```melbi
Math.Sqrt(25)           // Square root → 5.0
Math.Pow(2, 10)         // Power → 1024.0
```

**Trigonometry:**
```melbi
Math.Sin(Math.PI / 2)   // Sine → 1.0
Math.Cos(0)             // Cosine → 1.0
Math.Tan(Math.PI / 4)   // Tangent → 1.0
```

**Logarithms:**
```melbi
Math.Log(Math.E)        // Natural log → 1.0
Math.Log10(100)         // Base-10 log → 2.0
Math.Exp(1)             // e^x → 2.71828...
```

## The String Package

String manipulation functions:

**Inspection:**
```melbi
String.Len("Melbi")                        // Length → 5
String.IsEmpty("")                          // Check if empty → true
String.Contains("hello world", "world")     // Contains substring → true
String.StartsWith("hello", "hel")           // Starts with → true
String.EndsWith("hello", "lo")              // Ends with → true
```

**Transformation (ASCII only):**
```melbi
String.Upper("hello")                       // Uppercase → "HELLO"
String.Lower("HELLO")                       // Lowercase → "hello"
String.Trim("  hello  ")                    // Remove whitespace → "hello"
String.TrimStart("  hello")                 // Trim start → "hello"
String.TrimEnd("hello  ")                   // Trim end → "hello"
```

Note: `String.Upper` and `String.Lower` only work with ASCII characters (a-z, A-Z). For full Unicode support, the host can provide a `Unicode` package.

**Replacing:**
```melbi
String.Replace("hello world", "world", "Melbi")  // → "hello Melbi"
```

**Splitting and joining:**
```melbi
String.Split("a,b,c", ",")                  // → ["a", "b", "c"]
String.Join(["a", "b", "c"], "-")           // → "a-b-c"
```

**Parsing:**
```melbi
String.ToInt("42")                          // → some 42
String.ToInt("abc")                         // → none
String.ToFloat("3.14")                      // → some 3.14
```

These return Options because parsing can fail!

## The Array Package

Array operations (we'll see more in the next lessons):

**Inspection:**
```melbi
Array.Len([1, 2, 3])                        // Length → 3
Array.IsEmpty([])                           // Check if empty → true
```

**Note:** To get the first or last element, just use indexing: `arr[0]` or `arr[Array.Len(arr) - 1]`. You can use `otherwise` to handle empty arrays: `arr[0] otherwise "default"`.

## Chaining Function Calls

You can use the result of one function as input to another:

```melbi
Math.Sqrt(Math.Abs(-16))
```

This first calculates `Math.Abs(-16)` (which is `16.0`), then passes it to `Math.Sqrt` (which returns `4.0`).

With `where` bindings, you can make complex chains more readable:

```melbi
rounded where {
  raw_input = "  42.7  ",
  trimmed = String.Trim(raw_input),
  parsed = String.ToFloat(trimmed),
  rounded = parsed match {
    some value -> Math.Round(value),
    none -> 0
  }
}
```

## Mixing Functions and Operators

Functions work seamlessly with operators:

```melbi
result where {
  base = 10,
  exponent = 2,
  offset = 5,
  result = Math.Pow(base as Float, exponent as Float) + offset
}
```

Result: `105.0`

## Real-World Examples

### Temperature Converter

```melbi
fahrenheit where {
  celsius = 25,
  fahrenheit = celsius * 9 / 5 + 32,
  rounded = Math.Round(fahrenheit as Float)
}
```

### Distance Between Points

```melbi
distance where {
  x1 = 0, y1 = 0,
  x2 = 3, y2 = 4,
  dx = x2 - x1,
  dy = y2 - y1,
  distance = Math.Sqrt((dx * dx + dy * dy) as Float)
}
```

Result: `5.0` (the 3-4-5 triangle!)

### Email Validator

```melbi
is_valid where {
  email = "  USER@EXAMPLE.COM  ",
  trimmed = String.Trim(email),
  normalized = String.Lower(trimmed),
  has_at = String.Contains(normalized, "@"),
  has_dot = String.Contains(normalized, "."),
  is_valid = has_at and has_dot
}
```

### Price Calculator

```melbi
display_price where {
  price = 29.99,
  quantity = 3,
  tax_rate = 0.08,
  subtotal = price * quantity,
  tax = subtotal * tax_rate,
  total = subtotal + tax,
  rounded = Math.Round(total * 100.0) / 100.0,
  display_price = f"${rounded}"
}
```

### Parsing User Input

```melbi
parsed where {
  input = "  123  ",
  trimmed = String.Trim(input),
  parsed = String.ToInt(trimmed),
  result = parsed match {
    some n -> n * 2,
    none -> 0
  }
}
```

## Combining Your Lambdas with Package Functions

You can build your own functions that use package functions:

```melbi
result where {
  hypotenuse = (a, b) => Math.Sqrt((a * a + b * b) as Float),
  normalize = (s) => String.Lower(String.Trim(s)),
  
  distance = hypotenuse(3, 4),
  clean_email = normalize("  HELLO@EXAMPLE.COM  "),
  
  result = { distance, clean_email }
}
```

## Host-Provided Functions

Beyond the standard library, the application embedding Melbi can provide custom functions for your specific use case:

```melbi
// Example: A network filtering application might provide:
Packet.GetSourceIP()
Packet.GetDestPort()
Packet.GetProtocol()

// Example: A spreadsheet might provide:
Cell.Value("A1")
Cell.Formula("B2")
```

These work exactly like standard library functions—they're capitalized and called the same way.

## Try It Yourself

Try these challenges in the playground:

1. Calculate the fourth root of 256 using `Math.Pow` and a fractional exponent
2. Parse a string to a number, then round it using `Math.Round`
3. Build a name formatter that trims whitespace, converts to lowercase, and checks if it contains a space
4. Calculate the hypotenuse of a 5-12 right triangle using `Math.Sqrt`

## What's Next?

You've learned how to call functions from packages and combine them with your own lambdas. Next, we'll explore **higher-order functions**—functions that take other functions as arguments. This opens up powerful patterns like `Array.Map` and `Array.Filter` for transforming data!
