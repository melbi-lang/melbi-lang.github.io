---
title: Higher-Order Functions
layout: tutorial
parent: Functions
nav_order: 3
permalink: /tutorial/functions/higher-order-functions/
code_sample: |
  Array.Map([1, 2, 3], (x) => x * 2)
---

# Higher-Order Functions
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

You've seen functions that take numbers, strings, and other values. But functions can also take **other functions** as arguments—and return functions as results. These are called **higher-order functions**, and they're one of the most powerful patterns in programming.

## What are higher-order functions?

A **higher-order function** is a function that does at least one of these:
1. Takes a function as an argument
2. Returns a function as a result

You've already seen the second kind when you learned about currying:

```melbi
add_five(10) where {
    make_adder = (x) => (y) => x + y,
    add_five = make_adder(5),
}
```

`make_adder` returns a function, so it's a higher-order function. Now let's explore functions that **take** functions as arguments.

## Functions that take functions

### Applying a function twice

```melbi
apply_twice(double, 3) where {
    apply_twice = (f, x) => f(f(x)),
    double = (n) => n * 2,
}
```

Result: `12` (3 → 6 → 12)

`apply_twice` takes a function `f` and a value `x`, then applies `f` to `x` twice. Its type is:

```
((T) => T, T) => T
```

### Transforming collections

The most common higher-order functions operate on collections. Let's look at the patterns:

#### Map: Transform each element

```melbi
Array.Map([1, 2, 3], (x) => x * 2)
```

Result: `[2, 4, 6]`

`Map` applies a function to each element, building a new array with the results.

```melbi
Array.Map(["hello", "world"], (s) => String.Upper(s))
```

Result: `["HELLO", "WORLD"]`

Type: `(Array[E], (E) => A) => Array[A]`

#### Filter: Select elements

```melbi
Array.Filter([1, 2, 3, 4, 5], (x) => x > 2)
```

Result: `[3, 4, 5]`

`Filter` keeps only elements where the predicate returns `true`.

```melbi
Array.Filter(["apple", "banana", "apricot"], (s) => String.StartsWith(s, "a"))
```

Result: `["apple", "apricot"]`

Type: `(Array[E], (E) => Bool) => Array[E]`

#### Fold: Combine into a single value

```melbi
Array.Fold([1, 2, 3, 4], 0, (acc, x) => acc + x)
```

Result: `10` (0+1+2+3+4)

`Fold` processes each element, accumulating a result. It starts with an initial value (`0`), then for each element, combines the accumulator with that element.

```melbi
Array.Fold(["a", "b", "c"], "", (acc, s) => acc ++ s)
```

Result: `"abc"`

Type: `(Array[E], A, (A, E) => A) => A`

## Combining higher-order functions

The real power comes from combining these patterns:

```melbi
Array.Map(evens, (x) => x * 2) where {
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    is_even = (x) => x / 2 == (x + 1) / 2,
    evens = Array.Filter(numbers, is_even),
}
```

Result: `[4, 8, 12, 16, 20]`

This filters for even numbers, then doubles each one.

### Sum of squares of even numbers

```melbi
Array.Fold(squares, 0, (acc, n) => acc + n) where {
    numbers = [1, 2, 3, 4, 5],
    is_even = (n) => n / 2 == (n + 1) / 2,
    evens = Array.Filter(numbers, is_even),
    squares = Array.Map(evens, (n) => n * n),
}
```

Result: `20` (2² + 4² = 4 + 16 = 20)

## Creating your own higher-order functions

You can write higher-order functions too:

### Compose two functions

```melbi
add_then_double(5) where {
    compose = (f, g) => (x) => f(g(x)),
    add_one = (x) => x + 1,
    double = (x) => x * 2,
    add_then_double = compose(double, add_one),
}
```

Result: `12` (5+1=6, 6×2=12)

`compose` takes two functions and returns a new function that applies them in sequence.

Type: `((B) => C, (A) => B) => (A) => C`

### Negate a predicate

```melbi
Array.Filter(numbers, is_odd) where {
    is_even = (x) => x / 2 == (x + 1) / 2,
    negate = (pred) => (x) => not pred(x),
    is_odd = negate(is_even),
    numbers = [1, 2, 3, 4, 5],
}
```

Result: `[1, 3, 5]`

`negate` takes a predicate and returns the opposite predicate.

Type: `((T) => Bool) => (T) => Bool`

## Function factories

Higher-order functions are great for creating specialized functions:

### Comparison functions

```melbi
{ test1 = gt_10(15), test2 = gt_100(50) }
where {
    greater_than = (threshold) => (x) => x > threshold,
    gt_10 = greater_than(10),
    gt_100 = greater_than(100),
}
```

Result: `{ test1 = true, test2 = false }`

### String matchers

```melbi
{ test1 = starts_with_a("apple"), test2 = starts_with_hello("hello world") }
where {
    starts_with = (prefix) => (s) => String.StartsWith(s, prefix),
    starts_with_a = starts_with("a"),
    starts_with_hello = starts_with("hello"),
}
```

Result: `{ test1 = true, test2 = true }`

## Other useful patterns

### Find first matching element

```melbi
Array.Find(numbers, is_even) where {
    is_even = (x) => x / 2 == (x + 1) / 2,
    numbers = [1, 3, 5, 6, 7, 9],
}
```

Result: `some 6`

Type: `(Array[E], (E) => Bool) => Option[E]`

### Check if any/all elements match

```melbi
{
    any_negative = Array.Any(numbers, (x) => x < 0),
    all_positive = Array.All(numbers, (x) => x > 0),
}
where {
    numbers = [1, 2, 3, 4, 5],
}
```

Result: `{ any_negative = false, all_positive = true }`

### Sort by a key

```melbi
Array.SortBy(scores, (s) => s["score"]) where {
    scores = [
        {"id": 1, "score": 85},
        {"id": 2, "score": 92},
        {"id": 3, "score": 78},
    ],
}
```

Result: `[{"id": 3, "score": 78}, {"id": 1, "score": 85}, {"id": 2, "score": 92}]`

Type: `(Array[E], (E) => K) => Array[E]` where K is comparable

The function extracts a comparison key from each element. Here we sort maps by their `"score"` value.

## Why higher-order functions?

Higher-order functions let you:

1. **Separate what from how** - `Map` handles the iteration; you just say what to do with each element
2. **Reuse patterns** - Write the pattern once, use it with different functions
3. **Build abstractions** - Create specialized functions from general ones
4. **Write declarative code** - Say what you want, not how to do it step by step

Compare:

**Without higher-order functions** (if Melbi had loops):
```
// Pseudocode - not valid Melbi
result = []
for x in [1,2,3,4,5]:
    if x > 2:
        result.append(x * 2)
```

**With higher-order functions:**
```melbi
Array.Map(filtered, (x) => x * 2) where {
    numbers = [1, 2, 3, 4, 5],
    filtered = Array.Filter(numbers, (x) => x > 2),
}
```

Result: `[6, 8, 10]`

The second version clearly shows the intent: filter, then map.

## Try it yourself!

1. Use `Map` to convert a list of temperatures from Celsius to Fahrenheit
2. Use `Filter` to find all strings longer than 5 characters
3. Use `Fold` to find the product of all numbers in a list
4. Write a `map_option` function: `(Option[T], (T) => A) => Option[A]`
5. Write a function that takes a list of predicates and returns a predicate that's true when all are true

You've now learned the core of functional programming in Melbi! These patterns—mapping, filtering, folding, and composing functions—will serve you well in any expression you write.
