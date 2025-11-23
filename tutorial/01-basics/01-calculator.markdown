---
title: Melbi as a Calculator
layout: tutorial
parent: Basics
nav_order: 1
permalink: /tutorial/basics/calculator/
code_sample: |
  1 + 2
---

# Melbi as a Calculator
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Integers

Try it out above `1 + 2`, for instance.

Or `2 + 3 * 4`, which follows the normal order of operations.

You can also use parentheses to override the order of operations. For example, `(2 + 3) * 4` should evaluate to `20`. Try it out above!

Or `10 / 3`, which may be an unexpected outcome for some users. If you tried it you noticed that Melbi evaluates that to `3`.
So, if you provide integers, then you will get an integer result.

## Floating Point (Real Numbers)

Melbi also supports floating point numbers, which are numbers with a decimal point. For example, `1.5 + 2.5` should evaluate to `4.0`. Try it out above!

Or `10.0 / 3.0`, which should evaluate to `3.3333333333333335`. Try it out above!

Floating point numbers are useful when you need to perform calculations that involve fractions or decimals.

## Operations with Different Types

If you try something like
```melbi
1 + 1.0
```
you will get an error because you're trying to add two different types of numbers. Melbi prefers to be explicit since implicit conversions can be surprising and lead to unexpected results which can lead to bugs.

## Numeric Operators

{: .highlight }
> TODO
>
> Include all numeric operators.
> (Also this is not rendering correctly)
