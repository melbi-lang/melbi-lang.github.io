---
title: Options
layout: tutorial
parent: Type Safety
nav_order: 1
permalink: /tutorial/type-safety/options/
code_sample: |
  result match { some value -> value * 2, none -> 0 } where { result = some 42 }
---

# Options
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

In many languages, you have "null" or "nil" to represent missing values. But null is notorious for causing crashes! Melbi takes a safer approach with **Options** - a type that explicitly says "this might or might not have a value."

## The problem with missing values

Imagine you're looking up a user by ID. Sometimes the user exists, sometimes they don't. How do you represent "user not found"?

With Options, it's explicit:
- `some user` means "we found the user"
- `none` means "no user found"

No surprises, no crashes!

## Your first Option

There are two kinds of Option values:

### some - when you have a value

```melbi
some 42
```

This is an Option that contains the number 42.

```melbi
some "Hello"
```

An Option containing the string "Hello".

### none - when you don't have a value

```melbi
none
```

This represents "no value" - but in a safe, explicit way.

## Why Options are better than errors

Remember `otherwise` from the last lesson? Options give you another way to handle missing values - one that's even more explicit:

```melbi
users[user_id] otherwise none where {
    users = {"alice": some "Alice", "bob": some "Bob"},
    user_id = "charlie",
}
```

Instead of a fallback value, we're saying "this might not exist, and that's okay."

## Unwrapping Options with match

To use the value inside an Option, you use pattern matching (which you'll learn more about in the next lesson):

```melbi
result match {
    some value -> value * 2,
    none -> 0,
}
where { result = some 21 }
```

This says:
- If `result` is `some value`, multiply it by 2
- If `result` is `none`, return 0

The result is `42` (21 × 2).

If we had `result = none`:

```melbi
result match {
    some value -> value * 2,
    none -> 0,
}
where { result = none }
```

The result would be `0`.

## Practical examples

### User lookup

```melbi
greeting match {
    some name -> f"Welcome back, { name }!",
    none -> "Welcome, guest!",
}
where {
    user_id = "charlie",
    users = {"alice": "Alice", "bob": "Bob"},
    greeting = if user_id in users
        then some users[user_id]
        else none,
}
```

### Configuration value

```melbi
timeout match {
    some value -> value,
    none -> 30,
}
where {
    config = {"host": "api.example.com"},
    timeout = if "timeout" in config
        then some config["timeout"]
        else none,
}
```

### Safe division

```melbi
result match {
    some quotient -> f"Result: { quotient }",
    none -> "Cannot divide by zero",
}
where {
    numerator = 10,
    denominator = 0,
    result = if denominator != 0
        then some (numerator / denominator)
        else none,
}
```

### Email validation

```melbi
status match {
    some email -> f"Email { email } is valid",
    none -> "Invalid email address",
}
where {
    input = "user@example.com",
    status = if "@" in input and "." in input
        then some input
        else none,
}
```

## Nested Options

Options can be nested - an Option can contain another Option:

```melbi
some (some 42)
```

This is an Option containing an Option containing 42.

```melbi
some none
```

This is an Option containing "none" - different from just `none`!

You can handle nested Options with pattern matching:

```melbi
outer match {
    some (some value) -> f"Got value: { value }",
    some none -> "Got some, but inner was none",
    none -> "Got none",
}
where { outer = some (some 42) }
```

## Options with otherwise

You can combine Options with `otherwise` for even more flexibility:

```melbi
value match {
    some x -> x,
    none -> 0,
} otherwise -1
```

This unwraps the Option if successful, otherwise returns -1 if there's any error.

## The otherwise operator with Options

Remember how `otherwise` catches errors? It can also be used to convert an error
to an optional value:

```melbi
(some users[user_id] otherwise none) match {
    some name -> f"Hello, { name }",
    none -> "User not found",
}
where {
    users = {"alice": "Alice"},
    user_id = "bob",
}
```

If the lookup succeeds then `some value` is returned, if it fails,
`otherwise none` catches it and provides a `none` Option.

## Real-world examples

### API response handling

```melbi
message match {
    some user -> f"User: { user.name }, Email: { user.email }",
    none -> "No user data available",
}
where {
    response_success = true,
    user_data = { name = "Alice", email = "alice@example.com" },
    message = if response_success
        then some user_data
        else none,
}
```

### Form field validation

```melbi
age_status match {
    some age -> if age >= 18 then "Valid" else "Too young",
    none -> "Age not provided",
}
where {
    form_data = {"name": "John"},
    age_status = if "age" in form_data
        then some form_data["age"]
        else none,
}
```

### Cache lookup

```melbi
data match {
    some cached -> f"Using cached value: { cached }",
    none -> "Cache miss, fetching fresh data",
}
where {
    cache = {"user_123": "Alice"},
    user_id = "user_456",
    data = if user_id in cache
        then some cache[user_id]
        else none,
}
```

### Search results

```melbi
if found then some 1 else none match {
    some index -> f"Found at position { index }",
    none -> "Not found in list",
}
where {
    items = ["apple", "banana", "cherry"],
    search = "banana",
    found = items[1] == search,
}
```

## Options vs otherwise - when to use which?

**Use Options when:**
- Missing values are expected and normal
- You want to be explicit about "might not exist"
- You're building an API or returning results
- You want to distinguish between "no value" and "error"

**Use otherwise when:**
- You're catching unexpected errors
- You want a quick fallback
- You're dealing with external data that might be malformed
- You want to protect against crashes

**Use both:**
```melbi
(some lookup_value otherwise none) match {
    some x -> x * 2,
    none -> 0,
}
```

This catches errors with `otherwise` and handles missing values with Options!

## Type safety benefit

Here's why Options are safe:

Without Options (in many languages):
```
// In other languages:
user = users[id]  // might be null!
name = user.name  // CRASH if user was null!
```

With Options in Melbi:
```melbi
user match {
    some u -> u.name,
    none -> "Unknown",
}
```

You **must** handle both cases. The compiler won't let you forget!

## No unwrap in Melbi

Some languages with Options let you "unwrap" them - forcefully extract the value, crashing if it's none. Melbi doesn't have this!

There's no `.unwrap()` or `!` operator that says "trust me, this is `some`." This prevents a common source of crashes:

```
// In other languages (DON'T DO THIS!)
value = option.unwrap()  // CRASH if it's none!
```

In Melbi, you **must** use pattern matching or `otherwise`. This forces you to think about the none case:

```melbi
option match {
    some value -> value,
    none -> default_value,
}
```

Or use otherwise for a quick fallback:

```melbi
option otherwise default_value
```

This design ensures that Options actually make your code safer - they can't be bypassed!

## Try it yourself!

Create expressions that:

1. Look up a product price, return "Price not available" if missing
2. Parse a string to a number, return none if invalid
3. Get the first element of an array safely (return none if empty)
4. Check if a username is available (none = available, some = taken)
5. Handle nested Options for a database -> cache -> live-fetch scenario

Congratulations! You now understand Options - Melbi's way of making missing values explicit and safe.

Next, you'll learn about **Pattern Matching** - a powerful way to handle different cases elegantly!
