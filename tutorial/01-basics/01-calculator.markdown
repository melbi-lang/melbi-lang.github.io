---
title: Melbi as a Calculator
layout: tutorial
parent: Basics
nav_order: 1
permalink: /tutorial/basics/calculator/
code_sample: |
  2 + 3 * 4
---

# Melbi as a Calculator
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

Let's start with the basics! Every Melbi program is a single expression that evaluates to a value. The simplest expressions are arithmetic calculations.

## Your first expression

Try typing `1 + 2` in the playground above. You should see the result: `3`.

That's it! You've just written your first Melbi expression. Simple arithmetic works exactly as you'd expect.

## Integers

Melbi supports all the basic arithmetic operations with whole numbers (integers):

```melbi
42
```

```melbi
10 + 5
```

```melbi
20 - 8
```

```melbi
6 * 7
```

```melbi
15 / 3
```

Click the ▶️ button on any example above to try it in the playground!

### Order of operations

Melbi follows the standard mathematical order of operations (PEMDAS):

```melbi
2 + 3 * 4
```

This evaluates to `14`, not `20`, because multiplication happens before addition.

You can use parentheses to control the order:

```melbi
(2 + 3) * 4
```

Now it evaluates to `20` because the addition happens first.

### Integer division

Here's something that might surprise you:

```melbi
10 / 3
```

This gives you `3`, not `3.333...`

When you divide two integers, Melbi gives you an integer result. It drops the remainder. This is called "integer division" and it's intentional - Melbi doesn't silently convert types because that can lead to unexpected behavior.

## Floating Point Numbers

Need decimal results? Use floating point numbers by including a decimal point:

```melbi
10.0 / 3.0
```

Now you get `3.3333333333333335` - a decimal result!

You can also write:

```melbi
1.5 + 2.5
```

```melbi
3.14 * 2.0
```

```melbi
0.5
```

Even if there are no digits after the decimal point, you can still write it:

```melbi
3.
```

This is a float with the value `3.0`.

## Mixing types

What happens if you try this?

```melbi
1 + 1.0
```

You'll get an error! Melbi won't automatically convert between integers and floats. This might seem annoying at first, but it prevents subtle bugs. When you mix types accidentally, Melbi catches it immediately instead of giving you surprising results.

If you need to mix them, you'll learn about type conversion later in the tutorial.

## More operators

Melbi supports a few more math operations:

### Power (exponentiation)

```melbi
2 ^ 3
```

This calculates 2 to the power of 3, which is `8`.

```melbi
10 ^ 2
```

That's 10 squared: `100`.

### Negative numbers

```melbi
-42
```

```melbi
5 + -3
```

```melbi
-2.5 * 4.0
```

## Booleans - True and False

Before we dive deeper into numbers, let's quickly introduce another important type: booleans.

A boolean is a value that's either `true` or `false`. You'll use these a lot when making decisions (which you'll learn about in the Conditionals tutorial).

```melbi
true
```

```melbi
false
```

Comparisons produce boolean values:

```melbi
5 > 3
```

This evaluates to `true`.

```melbi
10 == 7
```

This evaluates to `false`.

You'll learn much more about using booleans in the Conditionals tutorial. For now, just know they exist and represent yes/no, true/false values.

## Number formats

Melbi supports different number formats for convenience:

### Hexadecimal (base 16)

```melbi
0xFF
```

That's `255` in decimal.

### Binary (base 2)

```melbi
0b1010
```

That's `10` in decimal.

### Octal (base 8)

```melbi
0o17
```

That's `15` in decimal.

### Underscores for readability

For large numbers, you can use underscores to make them easier to read:

```melbi
1_000_000
```

That's one million. The underscores are ignored - they're just there to help you read the number.

```melbi
0xFF_FF_FF
```

```melbi
3.141_592_653
```

## Try it yourself!

Now that you know the basics, try creating some expressions:

- Calculate your age in days (age × 365)
- Convert Celsius to Fahrenheit: `(C * 9.0 / 5.0) + 32.0`
- Calculate compound interest
- Try the quadratic formula components

Remember: every expression must result in a single value. In the next lesson, you'll learn how to build more complex expressions using variables!
