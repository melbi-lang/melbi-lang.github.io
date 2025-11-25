---
title: Generic Functions
layout: tutorial
parent: Functions
nav_order: 2
permalink: /tutorial/functions/generic-functions/
code_sample: |
  { int = id(42), str = id("hello"), bool = id(true) } where { id = (x) => x }
---

# Generic Functions
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

Some functions only work with specific types—a function with type `(Int) => Int` only accepts integers. But what about functions that can work with **any** type? These are called **generic functions**, and they're incredibly powerful.

## The identity function

The simplest generic function is the **identity function**—it just returns whatever you give it:

```melbi
id(42) where { id = (x) => x }
```

Result: `42`

But here's the interesting part—`id` works with any type:

```melbi
{
    int = id(42),
    str = id("hello"),
    bool = id(true),
}
where { id = (x) => x }
```

Result: `{ int = 42, str = "hello", bool = true }`

The same function works with Int, String, and Bool! How do we write its type?

## Type variables

Instead of writing a specific type like `Int` or `String`, we use a **type variable**:

```
(T) => T
```

The `T` is a placeholder that can represent any type. This reads as: "takes any type T, returns the same type T"

When you call `id(42)`, the type variable `T` becomes `Int`. When you call `id("hello")`, `T` becomes `String`. The type adapts to how you use the function!

### Common type variable names

By convention, type variables use single uppercase letters:

| Variable | Common usage |
|----------|--------------|
| `T` | General "type" |
| `A`, `B`, `C` | Multiple different types |
| `E` | Element type (in arrays) |
| `K`, `V` | Key and Value (in maps) |

## Reading generic type signatures

Let's look at some type signatures from the standard library:

### Array.Map

```
(Array[E], (E) => A) => Array[A]
```

Breaking this down:
- Takes an `Array[E]`—an array of some element type `E`
- Takes a function `(E) => A`—that transforms `E` into type `A`
- Returns `Array[A]`—an array of the transformed type

For example, if you have an array of integers and a function that converts integers to strings, you get back an array of strings:

```melbi
Array.Map([1, 2, 3], (n) => f"Number { n }")
```

Result: `["Number 1", "Number 2", "Number 3"]`

Here `E` is `Int` and `A` is `String`.

### Array.Filter

```
(Array[E], (E) => Bool) => Array[E]
```

Breaking this down:
- Takes an `Array[E]`—an array of some element type
- Takes a predicate `(E) => Bool`—that returns true/false for each element
- Returns `Array[E]`—an array of the **same** type (filtered)

```melbi
Array.Filter([1, 2, 3, 4, 5], (n) => n > 2)
```

Result: `[3, 4, 5]`

Notice that both the input and output have the same element type `E`.

### Map.Get

```
(Map[K, V], K) => Option[V]
```

Breaking this down:
- Takes a `Map[K, V]`—a map with key type `K` and value type `V`
- Takes a key of type `K`
- Returns `Option[V]`—either `some value` or `none`

```melbi
Map.Get({ name = "Alice", age = 30 }, "name")
```

Result: `some "Alice"`

## Writing your own generic functions

When you write a lambda, Melbi automatically infers if it's generic:

```melbi
{
    first = first_of_two(1, 2),
    second = first_of_two("a", "b"),
}
where {
    first_of_two = (a, b) => a,
}
```

Result: `{ first = 1, second = "a" }`

The type of `first_of_two` is `(T, T) => T`—it takes two values of the same type and returns one.

### A function with multiple type variables

```melbi
{
    pair1 = make_pair(1, "one"),
    pair2 = make_pair(true, 3.14),
}
where {
    make_pair = (a, b) => { first = a, second = b },
}
```

Result: `{ pair1 = { first = 1, second = "one" }, pair2 = { first = true, second = 3.14 } }`

The type of `make_pair` is `(A, B) => { first: A, second: B }`—it can take two different types.

## Generic vs. specific

Consider these two functions:

```melbi
{
    doubled = double_int(5),
    swapped = swap(1, 2),
}
where {
    double_int = (x) => x * 2,
    swap = (a, b) => { first = b, second = a },
}
```

- `double_int` has type `(Int) => Int`—the `* 2` operation requires integers
- `swap` has type `(A, B) => { first: B, second: A }`—it works with any types

The key insight: operations you perform inside the function determine whether it's generic. If you do math, you need numbers. If you just pass values around, any type works.

## The constant function

Another classic generic function:

```melbi
{
    always_five = always(5),
    result = always_five("ignored"),
}
where {
    always = (x) => (y) => x,
}
```

Result: `{ always_five = ..., result = 5 }`

The type is `(A) => (B) => A`—it takes any value, returns a function that ignores its argument and returns the original value.

## Practical examples

### Safe list access

```melbi
{
    found = get_or([1, 2, 3], 1, 0),
    not_found = get_or([1, 2, 3], 10, 0),
}
where {
    get_or = (arr, index, default) => Array.Get(arr, index) match {
        some value -> value,
        none -> default,
    },
}
```

Result: `{ found = 2, not_found = 0 }`

Type: `(Array[E], Int, E) => E`

### Apply function if condition is true

```melbi
{
    applied = apply_if(true, 5, (x) => x * 2),
    skipped = apply_if(false, 5, (x) => x * 2),
}
where {
    apply_if = (condition, value, f) => if condition then f(value) else value,
}
```

Result: `{ applied = 10, skipped = 5 }`

Type: `(Bool, T, (T) => T) => T`

### Default value for Option

```melbi
{
    has_value = unwrap_or(some 42, 0),
    no_value = unwrap_or(none, 0),
}
where {
    unwrap_or = (opt, default) => opt match {
        some value -> value,
        none -> default,
    },
}
```

Result: `{ has_value = 42, no_value = 0 }`

Type: `(Option[T], T) => T`

## Why generics matter

Generic functions let you write code once and use it with many types:

1. **Less duplication** - One `swap` function instead of `swap_int`, `swap_string`, `swap_bool`, etc.
2. **More flexibility** - Your functions work with types that don't exist yet
3. **Type safety** - The type checker still catches errors, even with generics

## Try it yourself!

Create generic functions that:

1. Return the second element of a pair: `(A, B) => B`
2. Wrap any value in an array: `(T) => Array[T]`
3. Apply a function twice: `((T) => T, T) => T`
4. Create a function that always returns a given value (the `always` function)

Next, you'll learn about **higher-order functions**—functions that take other functions as arguments or return functions as results.
