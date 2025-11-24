---
title: Generic Functions
layout: tutorial
parent: Functions
nav_order: 3
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

Some functions work with **any** type, while others only work with **specific** types. Understanding how types flow through functions is key to writing flexible, reusable code. Let's explore **generic functions**—functions that can work with multiple types!

## The Identity Function

The simplest generic function is the **identity function**—it just returns whatever you give it:

```melbi
id(42) where { id = (x) => x }
```

Result: `42`

What's its type? It takes some type and returns that same type. But it works with **any** type:

```melbi
results where {
  id = (x) => x,
  int_result = id(42),
  float_result = id(3.14),
  string_result = id("hello"),
  bool_result = id(true),
  results = { int_result, float_result, string_result, bool_result }
}
```

The same function works with integers, floats, strings, and booleans! The type parameter flows through: whatever type goes in, that same type comes out.

## Generic Lambdas You Create

Your own lambdas can be generic too! Here's a function that wraps a value in an array:

```melbi
results where {
  wrap = (x) => [x],
  int_arr = wrap(42),
  str_arr = wrap("hello"),
  results = { int_arr, str_arr }
}
```

Result: `{int_arr: [42], str_arr: ["hello"]}`

The type of `wrap` is: "for any type T, takes a T and returns an Array[T]". Whatever type you pass in, you get an array of that type back.

## Swapping Elements

Here's a function that returns two values in reverse order:

```melbi
swap(10, 20) where { swap = (a, b) => [b, a] }
```

Result: `[20, 10]`

The type: "for any type T, takes two Ts and returns an Array[T]". Both parameters must be the same type:

```melbi
valid where {
  swap = (a, b) => [b, a],
  numbers = swap(1, 2),         // Works - both Int
  strings = swap("a", "b"),     // Works - both String  
  valid = { numbers, strings }
}
```

This won't work:
```melbi
swap = (a, b) => [b, a],
result = swap(1, "hello")  // Error! Can't have Array[Int | String]
```

Both elements must be the same type because arrays are homogeneous.

## Multiple Type Parameters

Functions can have multiple independent type parameters. Imagine a `pair` function that creates a record from two values:

```melbi
result where {
  pair = (a, b) => { first: a, second: b },
  mixed = pair(42, "hello"),
  result = mixed
}
```

Result: `{first: 42, second: "hello"}`

The type: "for any types A and B, takes an A and a B, returns a record {first: A, second: B}". The two parameters can be different types!

```melbi
examples where {
  pair = (a, b) => { first: a, second: b },
  int_str = pair(1, "one"),
  str_bool = pair("yes", true),
  float_int = pair(3.14, 42),
  examples = [int_str, str_bool, float_int]
}
```

## Connected Type Parameters

Here's a fascinating example that shows how type parameters can be independent but still connected:

```melbi
get_or where {
  get_or = (a, b, c) => a[b] otherwise c,
  prices = { "apple": 1.50, "banana": 0.75 },
  result = get_or(prices, "grape", 0.0)
}
```

Result: `0.0` (since "grape" isn't in the map)

What's the type of `get_or`? Let's break it down:

When `a` is a `Map[K, V]`:
- `a` has type `Map[K, V]` (a map with key type K and value type V)
- `b` must have type `K` (to match the map's keys)
- `c` must have type `V` (the fallback when key isn't found)
- The result has type `V`

The key insight: **K and V are completely independent**—they can be ANY types. But they're **connected** through the map's structure. The key type flows from the map to the index parameter, and the value type flows from the map to both the fallback and the result.

With an array:

```melbi
get_or where {
  get_or = (a, b, c) => a[b] otherwise c,
  items = ["red", "green", "blue"],
  result = get_or(items, 5, "unknown")
}
```

Result: `"unknown"` (index 5 doesn't exist)

When `a` is an `Array[T]`:
- `a` has type `Array[T]`
- `b` must have type `Int` (array indexes are always integers)
- `c` must have type `T` (same as the array elements)
- The result has type `T`

Same function, works with both maps and arrays! This is polymorphic over the **Indexable** constraint.

## How Type Parameters Flow

When you call a generic function, Melbi figures out the types automatically. Let's trace how it works:

```melbi
wrap(42) where { wrap = (x) => [x] }
```

1. You call `wrap(42)`
2. Melbi sees `42` is type `Int`
3. The type parameter T becomes `Int`
4. So `wrap`'s type for this call is: `(Int) => Array[Int]`
5. Result: `[42]` which has type `Array[Int]`

Now with a string:

```melbi
wrap("hello") where { wrap = (x) => [x] }
```

1. You call `wrap("hello")`
2. Melbi sees `"hello"` is type `String`
3. The type parameter T becomes `String`
4. So `wrap`'s type for this call is: `(String) => Array[String]`
5. Result: `["hello"]` which has type `Array[String]`

Same function, different types!

## Constrained Generic Functions

Some operations only work with certain types. For example, you can't add booleans:

```melbi
(a, b) => a + b
```

This lambda uses the `+` operator, which only works with numbers (Int or Float). Melbi automatically restricts this function to **numeric types**.

It works with integers:
```melbi
add(10, 20) where { add = (a, b) => a + b }
```

Result: `30`

It works with floats:
```melbi
add(3.14, 2.86) where { add = (a, b) => a + b }
```

Result: `6.0`

But not with strings (yet - string concatenation with `++` is planned):
```melbi
add("hello", "world") where {
    add = (a, b) => a + b,
} // Error! Strings don't support +
```

Or booleans:
```melbi
add(true, false) where {
    add = (a, b) => a + b,
} // Error! Booleans don't support +
```

We say this function has a **constraint**: it's generic over types that support the `+` operator.

## Comparison Constraints

The comparison operators `<`, `>`, `<=`, `>=` also create constraints:

```melbi
(a, b) => if a > b then a else b
```

This only works with **comparable** types: Int, Float, and String.

With integers:
```melbi
max(10, 5) where { max = (a, b) => if a > b then a else b }
```

Result: `10`

With strings (alphabetical order):
```melbi
max("zebra", "apple") where { max = (a, b) => if a > b then a else b }
```

Result: `"zebra"`

But not with booleans:
```melbi
max(true, false) where {
  max = (a, b) => if a > b then a else b,
} // Error! Can't compare booleans with >
```

## Real-World Examples

### Generic First Element

Extract the first element, with a default if the array is empty:

```melbi
first_or where {
  first_or = (arr, default) => arr[0] otherwise default,
  numbers = first_or([1, 2, 3], 0),
  strings = first_or([], "none"),
  result = { numbers, strings }
}
```

This works with any type—the array element type and default must match.

### Building Pairs from Parallel Arrays

Combine two arrays element-by-element:

```melbi
pairs where {
  ids = [101, 102, 103],
  names = ["Alice", "Bob", "Charlie"],
  
  make_pair = (id, name) => { id: id, name: name },
  
  pair1 = make_pair(ids[0], names[0]),
  pair2 = make_pair(ids[1], names[1]),
  
  pairs = [pair1, pair2]
}
```

### Conditional Wrapper

Wrap a value in an array only if a condition is met:

```melbi
result where {
  wrap_if = (condition, value) => if condition then [value] else [],
  
  included = wrap_if(true, 42),
  excluded = wrap_if(false, 99),
  
  result = { included, excluded }
}
```

Result: `{included: [42], excluded: []}`

The function is generic—works with any value type.

### Range Checker

Check if a value is within a range:

```melbi
in_range where {
  between = (value, min, max) => value >= min and value <= max,
  
  check1 = between(5, 0, 10),
  check2 = between(15, 0, 10),
  
  in_range = { check1, check2 }
}
```

This requires the comparison constraint—only works with Int, Float, or String.

## Built-in Generic Functions

Standard library functions are also generic. For example, `Array.Len` works with any array type:

```melbi
lengths where {
  int_len = Array.Len([1, 2, 3]),
  str_len = Array.Len(["a", "b"]),
  nested_len = Array.Len([[1], [2]]),
  lengths = [int_len, str_len, nested_len]
}
```

All return the length, regardless of element type. The type signature: "for any type T, takes Array[T] and returns Int".

`Array.Reverse` is another example:

```melbi
reversed where {
  numbers = Array.Reverse([1, 2, 3]),
  words = Array.Reverse(["hello", "world"]),
  reversed = { numbers, words }
}
```

The type: "for any type T, takes Array[T] and returns Array[T]". Input and output have the same element type.

## Advanced Note: Type Theory

{: .note }
> **For the curious:** Generic functions are also called **parametrically polymorphic functions** in type theory. The types they work with are called **type parameters** or **type variables**. 
>
> For example, the identity function `(x) => x` has type `forall T. T => T`, meaning "for any type T, this function takes a T and returns a T."
>
> Constraints (like requiring numeric or comparable types) are called **type classes** or **traits** in programming language theory. Melbi uses traits internally to express "this type supports these operations."

## Try It Yourself

Try these challenges in the playground:

1. Write a generic function that duplicates a value: `dup(42)` → `[42, 42]`
2. Create a function that returns the second of three arguments (ignoring first and third)
3. Write a `min` function like `max` but returning the smaller value
4. Create a function that wraps a value in a record: `boxed(42)` → `{value: 42}`
5. Write a function that takes two values and returns them in a two-element array, but only if they're equal, otherwise returns an empty array

## What's Next?

You've learned how generic functions work and how types flow through them. Next, we'll explore **higher-order functions**—functions that take other functions as arguments. This unlocks powerful patterns like `Array.Map` for transforming data!
