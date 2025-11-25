---
title: Lambdas
layout: tutorial
parent: Functions
nav_order: 1
permalink: /tutorial/functions/lambdas/
code_sample: |
  double(5) where { double = (x) => x * 2 }
---

# Lambdas
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

So far, every expression you've written evaluates immediately. But what if you want to create reusable logic that runs when you need it? That's where **lambda expressions** (or just "lambdas") come in—they're functions you can define and call!

## Your first lambda

A lambda is a function without a name:

```melbi
(x) => x * 2
```

This creates a function that takes one parameter `x` and returns `x * 2`.

To use it with a where binding:

```melbi
double(5) where { double = (x) => x * 2 }
```

Result: `10`

The lambda is stored in `double`, then we call it with `5`.

## The structure

```melbi
(PARAMETERS) => EXPRESSION
```

- **Parameters** - The inputs (in parentheses)
- **Arrow** `=>` - Separates parameters from the body
- **Expression** - What the function returns

## Parameters

### Multiple parameters

```melbi
add(3, 4) where { add = (x, y) => x + y }
```

Result: `7`

```melbi
greet("Alice", "morning") where {
    greet = (name, time) => f"Good { time }, { name }!",
}
```

Result: `"Good morning, Alice!"`

### No parameters

If your lambda doesn't need parameters, use empty parentheses:

```melbi
get_pi() where { get_pi = () => 3.14159 }
```

Result: `3.14159`

### Single parameter

Even with one parameter, you need the parentheses:

```melbi
square(4) where { square = (x) => x * x }
```

Result: `16`

## Lambdas with complex expressions

The body can be any expression, including where bindings:

```melbi
calculate(5, 3) where {
    calculate = (a, b) => sum + product where {
        sum = a + b,
        product = a * b,
    },
}
```

Result: `23` (5+3=8, 5×3=15, 8+15=23)

## Function types

Every function has a **type** that describes what it accepts and what it returns:

```
(ParameterType) => ReturnType
```

This reads as: "takes ParameterType, returns ReturnType"

For example, the `double` function from earlier has type:

```
(Int) => Int
```

This means: "takes an Int, returns an Int"

### Multiple parameters in types

Functions can take multiple parameters:

```
(Int, Int) => Int
```

This means: "takes two Ints, returns an Int"

### Reading function types

When you see a function type, you can understand exactly what the function expects:

| Type | Meaning |
|------|---------|
| `(Int) => Int` | Takes one Int, returns an Int |
| `(String, String) => String` | Takes two Strings, returns a String |
| `(Float, Float) => Float` | Takes two Floats, returns a Float |
| `(String) => Int` | Takes a String, returns an Int |
| `() => Float` | Takes nothing, returns a Float |

### Why types matter

Understanding function types helps you:
- Know what arguments to provide
- Understand what you'll get back
- See which functions can work together
- Prepare for **generic functions** (coming next!)

## Currying

A lambda can return another lambda:

```melbi
add_five(10) where {
    make_adder = (x) => (y) => x + y,
    add_five = make_adder(5),
}
```

Result: `15`

This is called "currying"—`make_adder(5)` creates a new function that adds 5 to its input.

The type of `make_adder` is:

```
(Int) => (Int) => Int
```

Read this as: "takes an Int, returns a function that takes an Int and returns an Int"

Another example:

```melbi
double(5) + triple(5) where {
    multiply = (x) => (y) => x * y,
    double = multiply(2),
    triple = multiply(3),
}
```

Result: `25` (10 + 15)

## Lambdas with conditionals

```melbi
greet("Alice", true) where {
    greet = (name, is_member) => if is_member
        then f"Welcome back, { name }!"
        else f"Hello, { name }!",
}
```

Result: `"Welcome back, Alice!"`

## Lambdas with pattern matching

```melbi
describe(some 42) where {
    describe = (opt) => opt match {
        some value -> f"Got: { value }",
        none -> "Got nothing",
    },
}
```

Result: `"Got: 42"`

## Calling package functions

While you define your own lambdas with `lower_case` names, functions from packages use `UpperCamelCase`:

```melbi
my_double(stdlib_abs) where {
    my_double = (x) => x * 2.0,
    stdlib_abs = Math.Abs(-5.0),
}
```

Result: `10.0`

The naming convention helps you see at a glance what's from a package versus what you defined.

You can build your own functions that use package functions:

```melbi
hypotenuse(3.0, 4.0) where {
    hypotenuse = (a, b) => Math.Sqrt(a * a + b * b),
}
```

Result: `5.0`

### Host-provided functions

Beyond the standard library, the application running Melbi can provide custom functions specific to your domain. For example, a spreadsheet tool might provide `Cell.Value("A1")`, or an email system might provide `Email.GetSubject()`. These work exactly like standard library functions.

## Lambdas are values

You can pass lambdas around just like numbers or strings:

```melbi
operation(5) where {
    double = (x) => x * 2,
    triple = (x) => x * 3,
    operation = double,
}
```

Result: `10` (using `double`)

Change `operation = triple` and you'd get `15` instead!

This is what makes functions **first-class values**—they can be stored in bindings, passed as arguments, and returned from other functions.

## Practical examples

### Temperature converter

```melbi
celsius_to_fahrenheit(25.0) where {
    celsius_to_fahrenheit = (c) => (c * 9.0 / 5.0) + 32.0,
}
```

Result: `77.0`

### Distance calculator

```melbi
distance(0.0, 0.0, 3.0, 4.0) where {
    distance = (x1, y1, x2, y2) => Math.Sqrt((x2 - x1) ^ 2.0 + (y2 - y1) ^ 2.0),
}
```

Result: `5.0` (the 3-4-5 triangle!)

### Validation function

```melbi
validate_email("user@example.com") where {
    validate_email = (email) => "@" in email and "." in email,
}
```

Result: `true`

### Price calculator with tax

```melbi
calculate_total(29.99, 3.0, 0.08) where {
    calculate_total = (price, quantity, tax_rate) => price * quantity * (1.0 + tax_rate),
}
```

Result: `97.1676`

### Multiple lambdas working together

```melbi
sum_of_squares(3, 4) where {
    add = (x, y) => x + y,
    multiply = (x, y) => x * y,
    square = (x) => multiply(x, x),
    sum_of_squares = (a, b) => add(square(a), square(b)),
}
```

Result: `25` (3²+4²=9+16=25)

## Why functions?

**Without functions:**
```melbi
final_a_b + final_c_d where {
    a = 5,
    b = 3,
    sum_a_b = a + b,
    product_a_b = a * b,
    final_a_b = sum_a_b + product_a_b,
    c = 10,
    d = 7,
    sum_c_d = c + d,
    product_c_d = c * d,
    final_c_d = sum_c_d + product_c_d,
}
```

**With functions:**
```melbi
calculate(5, 3) + calculate(10, 7) where {
    calculate = (x, y) => (x + y) + (x * y),
}
```

Much cleaner!

## Common patterns

### Factory functions

```melbi
say_hello("Alice") where {
    make_greeter = (greeting_word) => (name) => f"{ greeting_word }, { name }!",
    say_hello = make_greeter("Hello"),
    say_hi = make_greeter("Hi"),
}
```

Result: `"Hello, Alice!"`

### Compose calculations

```melbi
double(add_ten(5)) where {
    add_ten = (x) => x + 10,
    double = (x) => x * 2,
}
```

Result: `30` (5+10=15, 15×2=30)

### Configuration functions

```melbi
build_url("https", "api.example.com", "v1/users") where {
    build_url = (protocol, host, path) => f"{ protocol }://{ host }/{ path }",
}
```

Result: `"https://api.example.com/v1/users"`

## Try it yourself!

Create functions that:

1. Calculate the area of a circle given radius
2. Convert between units (miles to kilometers, etc.)
3. Check if a number is even
4. Format a date string from year, month, day
5. Create a curried function for calculating compound interest

Functions let you create reusable logic! Next, you'll learn about **generic functions**—functions that can work with any type.
