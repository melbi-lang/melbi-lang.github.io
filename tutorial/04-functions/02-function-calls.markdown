---
title: Function Calls
layout: tutorial
parent: Functions
nav_order: 2
permalink: /tutorial/functions/function-calls/
code_sample: |
  absolute + square_root where {
    absolute = Math.Abs(-42.0),
    square_root = Math.Sqrt(16.0),
  }
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

You've learned how to create your own lambdas. But Melbi also provides **built-in functions** through packages, and the application embedding Melbi can provide **custom functions** for your specific use case. Let's learn how to call these functions and understand their types!

## Functions from Packages

While you define your own lambdas with lowercase names, functions from packages use capitalized names:

```melbi
my_double(stdlib_abs) where {
  my_double = (x) => x * 2.,     // Your lambda (lowercase)
  stdlib_abs = Math.Abs(-5.0),   // Package function (capitalized)
}
```

Result: `10.0`

The naming convention helps you see at a glance what's from a package versus what you defined.

## Function Types

Every function has a **type** that describes what it accepts and what it returns. The syntax looks like this:

```
(ParameterType) => ReturnType
```

This reads as: "takes ParameterType, returns ReturnType"

For example, `Math.Abs` has type:
```
(Float) => Float
```

This means: "takes a Float, returns a Float"

### Multiple Parameters

Functions can take multiple parameters:

```
(Float, Float) => Float
```

This means: "takes two Floats, returns a Float"

For example, `Math.Pow` (power/exponentiation) has this type—it takes a base and an exponent, both Floats, and returns a Float.

### Why Function Types Matter

Understanding function types helps you:
- Know what arguments to provide
- Understand what you'll get back
- See which functions can work together
- Prepare for **generic functions** (coming next!)

## Calling Package Functions

To call a function from a package, use the package name, a dot, and the function name:

```melbi
Math.Abs(-42.0)
```

Type: `(Float) => Float`
Result: `42.0`

With multiple arguments:

```melbi
Math.Pow(2.0, 8.0)
```

Type: `(Float, Float) => Float`  
Result: `256.0` (2 to the power of 8)

## Return Values

Every function returns a value. You can use that value in larger expressions:

```melbi
squared where {
  base = Math.Abs(-10.0),
  squared = Math.Pow(base, 2.0),
}
```

Result: `100.0`

## Chaining Function Calls

Since functions return values, you can use one function's output as another's input:

```melbi
Math.Sqrt(Math.Abs(-16.0))
```

This works because:
1. `Math.Abs(-16.0)` has type `(Float) => Float`, returns `16.0`
2. `Math.Sqrt(16.0)` has type `(Float) => Float`, returns `4.0`

The output type of `Abs` matches the input type of `Sqrt`, so they fit together!

For readability, you can use `where` bindings:

```melbi
result where {
  negative = -16.0,
  positive = Math.Abs(negative),
  root = Math.Sqrt(positive),
  result = root
}
```

Result: `4.0`

## A Few Examples

Let's look at a few package functions to understand the concepts. These aren't exhaustive lists—they're examples to teach you how functions work!

### Math Functions

**Absolute value:**
```melbi
Math.Abs(-42.0)
```
Type: `(Float) => Float`  
Takes a number, returns its absolute value

**Square root:**
```melbi
Math.Sqrt(25.0)
```
Type: `(Float) => Float`  
Takes a number, returns its square root

**Power:**
```melbi
Math.Pow(3.0, 4.0)
```
Type: `(Float, Float) => Float`  
Takes base and exponent, returns base^exponent (81.0)

**Rounding:**
```melbi
Math.Round(3.7)
```
Type: `(Float) => Int`  
Notice: takes Float, **returns Int**! (Result: `4`)

### String Functions

**Remove whitespace:**
```melbi
String.Trim("  hello  ")
```
Type: `(String) => String`  
Returns: `"hello"`

**Change case (ASCII only):**
```melbi
String.Upper("hello")
```
Type: `(String) => String`  
Returns: `"HELLO"`

Note: `Upper` and `Lower` only work with ASCII characters (a-z, A-Z). For full Unicode support, the host can provide a `Unicode` package.

**Get length:**
```melbi
String.Len("Melbi")
```
Type: `(String) => Int`  
Notice: takes String, **returns Int**! (Result: `5`)

## Different Return Types

Pay attention to return types! Some functions return a different type than they accept:

```melbi
doubled where {
  text = "Hello, world!",
  length = String.Len(text),     // String => Int
  doubled = length * 2,          // Can do math with Int
}
```

Result: `26`

## Combining Your Lambdas with Package Functions

You can build your own functions that use package functions:

```melbi
distance where {
  hypotenuse = (a, b) => Math.Sqrt(a * a + b * b),
  distance = hypotenuse(3.0, 4.0),
}
```

Result: `5.0`

Your lambda `hypotenuse` uses `Math.Sqrt` internally. You've composed your own logic with the standard library!

Another example:

```melbi
clean where {
  normalize = (text) => String.Lower(String.Trim(text)),
  clean = normalize("  HELLO@EXAMPLE.COM  "),
}
```

Result: `"hello@example.com"`

## Host-Provided Functions

Beyond the standard library, the application embedding Melbi can provide custom functions specific to your domain:

```melbi
// Example: A network filtering tool might provide:
Packet.GetSourceIP()
Packet.GetDestPort()
Packet.GetProtocol()

// Example: A spreadsheet might provide:
Cell.Value("A1")
Cell.Formula("B2")

// Example: An email system might provide:
Email.GetSender()
Email.GetSubject()
```

These work exactly like standard library functions—capitalized names, same calling syntax, type-safe.

## Type Safety

Melbi checks that your function arguments match the parameter types:

This works:
```melbi
Math.Sqrt(16.0)  // Float argument for Float parameter ✓
```

This doesn't:
```melbi
Math.Sqrt("hello")  // String argument for Float parameter ✗
```

The type checker catches this before your code runs, preventing errors!

## Real-World Examples

### Temperature Converter

```melbi
rounded where {
  celsius = 25.0,
  fahrenheit = (celsius * 9.0 / 5.0) + 32.0,
  rounded = Math.Round(fahrenheit),
}
```

Result: `77` (note: Int because Round returns Int)

### Distance Between Points

```melbi
distance where {
  x1 = 0.0, y1 = 0.0,
  x2 = 3.0, y2 = 4.0,
  dx = x2 - x1,
  dy = y2 - y1,
  distance_squared = (dx * dx + dy * dy),
  distance = Math.Sqrt(distance_squared)
}
```

Result: `5.0` (the classic 3-4-5 triangle!)

### Email Validation

```melbi
is_valid where {
  email = "  USER@EXAMPLE.COM  ",
  trimmed = String.Trim(email),
  normalized = String.Lower(trimmed),
  has_at = "@" in normalized,
  has_dot = "." in normalized,
  is_valid = has_at and has_dot
}
```

Result: `true`

## Try It Yourself

Try these challenges:

1. Calculate the hypotenuse of a right triangle with sides 5 and 12 using `Math.Sqrt`
2. Clean up user input: trim whitespace and convert to lowercase
3. Calculate the fourth root of 256 using `Math.Sqrt` twice (hint: square root of square root)
4. Check if an email contains both "@" and "." after trimming and lowercasing

## What's Next?

You've learned how to call functions and understand their types. But you might have noticed something interesting: `Math.Sqrt` works with any Float, `String.Trim` works with any String.

What about functions that work with **any type at all**? That's where **generic functions** come in—and they're more powerful than you might think!
