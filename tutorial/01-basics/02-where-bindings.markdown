---
title: Where Bindings
layout: tutorial
parent: Basics
nav_order: 2
permalink: /tutorial/basics/where-bindings/
code_sample: |
  total where { price = 100, tax = 0.08, total = price * (1 + tax) }
---

# Where Bindings
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

In the last lesson, you learned how to write simple calculations. But what if your expression gets more complex? Repeating values and sub-calculations makes code hard to read and maintain.

That's where `where` bindings come in - they let you give names to values and reuse them!

## Your first where binding

Let's calculate a total price with tax:

```melbi
price * (1 + tax) where { price = 100, tax = 0.08 }
```

This reads naturally: "price times (1 plus tax), **where** price is 100 and tax is 0.08"

The result is `108.0`.

## How it works

A `where` binding has two parts:

1. **The main expression** (before `where`) - this is what you're calculating
2. **The bindings** (after `where` in curly braces) - these define the values you're using

Think of it like solving a math problem where you're given some values first, then use them in a formula.

## Multiple bindings

You can define as many names as you need, separated by commas:

```melbi
a + b + c where { a = 5, b = 10, c = 15 }
```

The names are available to use anywhere after they're defined.

## Using bindings in other bindings

Here's where it gets powerful - you can use earlier bindings to calculate later ones:

```melbi
total where {
    price = 100,
    tax_rate = 0.08,
    tax = price * tax_rate,
    total = price + tax,
}
```

Notice how `tax` uses `price` and `tax_rate`, then `total` uses both `price` and `tax`. Each binding can reference any binding defined before it.

## Multi-line format

For longer expressions, you can write them across multiple lines for readability:

```melbi
final_price where {
    base_price = 299.99,
    discount = 0.15,
    discounted = base_price * (1 - discount),
    tax_rate = 0.0725,
    tax = discounted * tax_rate,
    final_price = discounted + tax,
}
```

Try clicking the ▶️ button and see how each step builds on the previous one!

## Practical examples

### Distance calculation

```melbi
distance where {
    x1 = 0,
    y1 = 0,
    x2 = 3,
    y2 = 4,
    dx = x2 - x1,
    dy = y2 - y1,
    distance = (dx ^ 2 + dy ^ 2) ^ 0.5,
}
```

This calculates the distance between two points: `(0,0)` and `(3,4)`.

### Compound interest

```melbi
amount where {
    principal = 1000,
    rate = 0.05,
    years = 10,
    amount = principal * ((1 + rate) ^ years),
}
```

Calculate how much $1000 grows at 5% interest over 10 years.

### Temperature conversion

```melbi
fahrenheit where {
    celsius = 25,
    fahrenheit = (celsius * 9.0 / 5.0) + 32.0,
}
```

Convert 25°C to Fahrenheit.

## Why use where bindings?

1. **Clarity** - Name your values so your expression reads like English
2. **Reusability** - Calculate something once, use it multiple times
3. **Organization** - Break complex calculations into understandable steps
4. **No repetition** - Don't write `price * 1.08` three times, write `price` once

## Important rules

1. Names must start with a lowercase letter: `price` ✓, `Price` ✗
2. Names can contain letters, numbers, and underscores: `tax_rate_2024` ✓
3. You can't redefine a name - each name appears once
4. You can only use names that were defined before (or to the left of) where you use them

## Try it yourself!

Try writing these expressions with `where` bindings:

1. Calculate the area of a circle given its radius (use `3.14159` for π)
2. Figure out how many days until your next birthday
3. Calculate a 20% tip on a $45.50 meal
4. Convert miles per hour to meters per second

In the next lesson, you'll learn how to work with text!
