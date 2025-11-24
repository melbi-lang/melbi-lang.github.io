---
title: Lambda Expressions
layout: tutorial
parent: Functions
nav_order: 1
permalink: /tutorial/functions/lambdas/
code_sample: |
  double(5) where { double = (x) => x * 2 }
---

# Lambda Expressions
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

So far, every expression you've written evaluates immediately. But what if you want to create reusable logic that runs when you need it? That's where **lambda expressions** (or just "lambdas") come in - they're functions you can define and call!

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

## Multiple parameters

```melbi
add(3, 4) where { add = (x, y) => x + y }
```

Result: `7`

```melbi
greet("Alice", "morning") where {
  greet = (name, time) => f"Good {time}, {name}!"
}
```

Result: `"Good morning, Alice!"`

## No parameters

If your lambda doesn't need parameters, use empty parentheses:

```melbi
get_pi() where { get_pi = () => 3.14159 }
```

Result: `3.14159`

```melbi
greeting() where { greeting = () => "Hello, world!" }
```

Result: `"Hello, world!"`

## Single parameter - still needs parentheses

Even with one parameter, you need the parentheses:

```melbi
square(4) where { square = (x) => x * x }
```

Result: `16`

## Lambdas with complex expressions

The body can be any expression, including where bindings:

```melbi
calculate(5, 3) where {
  calculate = (a, b) => result where {
    sum = a + b,
    product = a * b,
    result = sum + product
  }
}
```

Result: `23` (5+3=8, 5×3=15, 8+15=23)

## Practical examples

### Temperature converter

```melbi
fahrenheit where {
  celsius_to_fahrenheit = (c) => (c * 9.0 / 5.0) + 32.0,
  celsius = 25,
  fahrenheit = celsius_to_fahrenheit(celsius)
}
```

### Distance calculator

```melbi
distance where {
  calculate_distance = (x1, y1, x2, y2) => 
    ((x2 - x1) ^ 2 + (y2 - y1) ^ 2) ^ 0.5,
  distance = calculate_distance(0, 0, 3, 4)
}
```

Result: `5.0` (the 3-4-5 triangle!)

### Discount calculator

```melbi
final_price where {
  apply_discount = (price, discount_percent) =>
    price * (1.0 - discount_percent / 100.0),
  final_price = apply_discount(100.0, 15.0)
}
```

Result: `85.0`

### Full name formatter

```melbi
display_name where {
  format_name = (first, last) => f"{first} {last}",
  display_name = format_name("John", "Doe")
}
```

## Lambdas that return lambdas (Currying)

A lambda can return another lambda:

```melbi
add_five where {
  make_adder = (x) => (y) => x + y,
  add_five = make_adder(5),
  result = add_five(10)
}
```

Result: `15`

This is called "currying" - `make_adder(5)` creates a new function that adds 5 to its input.

Another example:

```melbi
result where {
  multiply = (x) => (y) => x * y,
  double = multiply(2),
  triple = multiply(3),
  result = double(5) + triple(5)
}
```

Result: `25` (10 + 15)

## Lambdas with conditionals

```melbi
message where {
  greet = (name, is_member) =>
    if is_member
    then f"Welcome back, {name}!"
    else f"Hello, {name}!",
  message = greet("Alice", true)
}
```

## Lambdas with pattern matching

```melbi
result where {
  describe = (opt) => opt match {
    some value -> f"Got: {value}",
    none -> "Got nothing"
  },
  result = describe(some 42)
}
```

## Real-world examples

### Validation function

```melbi
is_valid where {
  validate_email = (email) =>
    "@" in email and "." in email,
  is_valid = validate_email("user@example.com")
}
```

### Price calculator with tax

```melbi
total where {
  calculate_total = (price, quantity, tax_rate) =>
    price * quantity * (1.0 + tax_rate),
  total = calculate_total(29.99, 3, 0.08)
}
```

### Permission checker

```melbi
can_edit where {
  has_permission = (role, resource) =>
    role == "admin" or (role == "editor" and resource == "post"),
  can_edit = has_permission("editor", "post")
}
```

### Score calculator

```melbi
final_score where {
  calculate_score = (correct, total) =>
    ((correct as Float) / (total as Float)) * 100.0,
  final_score = calculate_score(17, 20)
}
```

## Multiple lambdas working together

```melbi
result where {
  add = (x, y) => x + y,
  multiply = (x, y) => x * y,
  square = (x) => multiply(x, x),
  sum_of_squares = (a, b) => add(square(a), square(b)),
  result = sum_of_squares(3, 4)
}
```

Result: `25` (3²+4²=9+16=25)

## Why lambdas?

**Without lambdas:**
```melbi
result where {
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
  
  result = final_a_b + final_c_d
}
```

**With lambdas:**
```melbi
result where {
  calculate = (x, y) => (x + y) + (x * y),
  result = calculate(5, 3) + calculate(10, 7)
}
```

Much cleaner!

## Lambdas are values

You can pass lambdas around just like numbers or strings:

```melbi
result where {
  double = (x) => x * 2,
  triple = (x) => x * 3,
  operation = double,
  result = operation(5)
}
```

Result: `10` (using `double`)

Change `operation = triple` and you'd get `15` instead!

## Common patterns

### Factory functions

```melbi
greeting where {
  make_greeter = (greeting_word) =>
    (name) => f"{greeting_word}, {name}!",
  say_hello = make_greeter("Hello"),
  say_hi = make_greeter("Hi"),
  greeting = say_hello("Alice")
}
```

### Compose calculations

```melbi
result where {
  add_ten = (x) => x + 10,
  double = (x) => x * 2,
  result = double(add_ten(5))
}
```

Result: `30` (5+10=15, 15×2=30)

### Configuration functions

```melbi
url where {
  build_url = (protocol, host, path) =>
    f"{protocol}://{host}/{path}",
  url = build_url("https", "api.example.com", "v1/users")
}
```

## Try it yourself!

Create lambdas that:

1. Calculate the area of a circle given radius
2. Convert between units (miles to kilometers, etc.)
3. Check if a number is even
4. Format a date string from year, month, day
5. Create a curried function for calculating compound interest

Lambdas let you create reusable logic! Next, you'll learn about **Function Calls** and how to work with functions that come from outside your expression.
