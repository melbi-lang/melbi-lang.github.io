---
title: Pattern Matching
layout: tutorial
parent: Type Safety
nav_order: 2
permalink: /tutorial/type-safety/pattern-matching/
code_sample: |
  status match { 200 -> "OK", 404 -> "Not Found", 500 -> "Error", _ -> "Unknown" }
  where { status = 404 }
---

# Pattern Matching
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

You've already seen pattern matching with Options. But `match` is much more powerful! It lets you handle different cases elegantly and safely, replacing complex chains of `if-then-else`.

## Your first match expression

```melbi
day match {
  1 -> "Monday",
  2 -> "Tuesday", 
  3 -> "Wednesday",
  _ -> "Other day"
}
where { day = 2 }
```

This checks `day` against each pattern and returns the matching result. The underscore `_` is a wildcard that matches anything.

Result: `"Tuesday"`

## The structure

```melbi
VALUE match {
  PATTERN1 -> RESULT1,
  PATTERN2 -> RESULT2,
  PATTERN3 -> RESULT3
}
```

Melbi tries each pattern from top to bottom and uses the first match.

## Literal patterns

Match exact values:

### Numbers

```melbi
score match {
  100 -> "Perfect!",
  90 -> "Excellent",
  80 -> "Good",
  _ -> "Keep trying"
}
where { score = 90 }
```

### Strings

```melbi
command match {
  "start" -> "Starting...",
  "stop" -> "Stopping...",
  "restart" -> "Restarting...",
  _ -> "Unknown command"
}
where { command = "start" }
```

### Booleans

```melbi
flag match {
  true -> "Enabled",
  false -> "Disabled"
}
where { flag = true }
```

## Wildcard pattern: _

The underscore matches anything and is typically used as the last case:

```melbi
status_code match {
  200 -> "Success",
  404 -> "Not Found",
  500 -> "Server Error",
  _ -> "Other status"
}
where { status_code = 403 }
```

Result: `"Other status"`

Think of `_` as "anything else" or "default case".

## Variable patterns

Bind the value to a name:

```melbi
result match {
  value -> value * 2
}
where { result = 21 }
```

This binds `result` to the name `value`, then doubles it. Result: `42`.

This is most useful when you want to transform the value:

```melbi
input match {
  x -> f"You entered: {x}"
}
where { input = "hello" }
```

## Option patterns

We've seen these before:

```melbi
maybe_user match {
  some name -> f"Hello, {name}!",
  none -> "Hello, guest!"
}
where { maybe_user = some "Alice" }
```

You can also nest them:

```melbi
outer match {
  some (some value) -> f"Double some: {value}",
  some none -> "Some none",
  none -> "Just none"
}
where { outer = some (some 42) }
```

## Exhaustiveness checking

Melbi is smart about patterns. For certain types, it ensures you handle all cases:

### Booleans

```melbi
flag match {
  true -> "yes",
  false -> "no"
}
```

Both cases covered! ✓

If you forget one:
```melbi
flag match {
  true -> "yes"
}
```

Melbi will complain - you must handle `false` (or use `_` wildcard).

### Options

```melbi
opt match {
  some x -> x,
  none -> 0
}
```

Both cases covered! ✓

### Other types need a wildcard

For numbers, strings, etc., you need a catch-all:

```melbi
n match {
  1 -> "one",
  2 -> "two",
  _ -> "many"
}
```

The `_` makes it exhaustive.

## Practical examples

### HTTP status handling

```melbi
response match {
  200 -> { success = true, message = "OK" },
  201 -> { success = true, message = "Created" },
  404 -> { success = false, message = "Not Found" },
  500 -> { success = false, message = "Server Error" },
  _ -> { success = false, message = "Unknown Error" }
}
where { response = 404 }
```

### Grade mapping

```melbi
letter match {
  "A" -> 4.0,
  "B" -> 3.0,
  "C" -> 2.0,
  "D" -> 1.0,
  "F" -> 0.0,
  _ -> 0.0
}
where { letter = "B" }
```

### State machine

```melbi
state match {
  "idle" -> "Ready",
  "loading" -> "Please wait...",
  "success" -> "Complete!",
  "error" -> "Something went wrong",
  _ -> "Unknown state"
}
where { state = "loading" }
```

### Permission levels

```melbi
role match {
  "admin" -> 100,
  "moderator" -> 50,
  "user" -> 10,
  "guest" -> 1,
  _ -> 0
}
where { role = "moderator" }
```

## Matching with complex expressions

You can match on the result of calculations:

```melbi
(age / 10) match {
  0 -> "Child",
  1 -> "Teenager",
  2 -> "Young Adult",
  _ -> "Adult"
}
where { age = 25 }
```

```melbi
(score >= 90) match {
  true -> "A",
  false -> "Not an A"
}
where { score = 95 }
```

## Combining with where bindings

```melbi
message where {
  user_type = "premium",
  discount = user_type match {
    "premium" -> 0.20,
    "standard" -> 0.10,
    "trial" -> 0.05,
    _ -> 0.0
  },
  message = f"Your discount: {discount * 100}%"
}
```

## Real-world examples

### Payment processing

```melbi
result where {
  payment_status = "completed",
  amount = 99.99,
  message = payment_status match {
    "completed" -> f"Payment of ${amount} successful",
    "pending" -> "Payment is being processed",
    "failed" -> "Payment failed, please try again",
    "refunded" -> f"Refund of ${amount} issued",
    _ -> "Unknown payment status"
  }
}
```

### File type detection

```melbi
description where {
  extension = ".jpg",
  file_type = extension match {
    ".jpg" -> "JPEG Image",
    ".png" -> "PNG Image",
    ".gif" -> "GIF Image",
    ".pdf" -> "PDF Document",
    ".txt" -> "Text File",
    _ -> "Unknown File Type"
  }
}
```

### Game action handling

```melbi
result where {
  action = "attack",
  damage = 50,
  result = action match {
    "attack" -> f"Dealt {damage} damage",
    "defend" -> "Raised shield",
    "heal" -> "Restored health",
    "flee" -> "Ran away",
    _ -> "Invalid action"
  }
}
```

### API error codes

```melbi
user_message where {
  error_code = "AUTH_FAILED",
  user_message = error_code match {
    "AUTH_FAILED" -> "Invalid username or password",
    "RATE_LIMITED" -> "Too many requests, please wait",
    "NOT_FOUND" -> "Resource not found",
    "NETWORK_ERROR" -> "Connection failed",
    _ -> "An error occurred"
  }
}
```

## Pattern matching vs if-then-else

Compare these two approaches:

**With if-then-else:**
```melbi
if status == 200 then "OK"
else if status == 404 then "Not Found"
else if status == 500 then "Error"
else "Unknown"
where { status = 404 }
```

**With pattern matching:**
```melbi
status match {
  200 -> "OK",
  404 -> "Not Found",
  500 -> "Error",
  _ -> "Unknown"
}
where { status = 404 }
```

Pattern matching is:
- More concise
- Easier to read
- Safer (exhaustiveness checking)
- More maintainable

## When to use pattern matching

**Use match when:**
- You're handling multiple specific cases
- Working with Options or other variant types
- Want exhaustiveness checking
- Need cleaner, more declarative code

**Use if-then-else when:**
- You have just one or two conditions
- Conditions are complex comparisons (like `x > 10 and y < 20`)
- You're combining multiple boolean checks

Often you'll use both in the same expression!

```melbi
result match {
  some value -> if value > 100 then "High" else "Normal",
  none -> "Unknown"
}
where { result = some 150 }
```

## Try it yourself!

Create expressions that:

1. Match day numbers (1-7) to day names
2. Convert HTTP methods ("GET", "POST", etc.) to descriptions
3. Handle game results ("win", "lose", "draw") with scores
4. Map error codes to user-friendly messages
5. Classify ages into categories with pattern matching

You've mastered pattern matching! You can now handle complex branching logic elegantly and safely.

Next, you'll learn about **Type Casting** - converting between different types explicitly!
