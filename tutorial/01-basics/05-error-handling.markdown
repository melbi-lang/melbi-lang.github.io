---
title: Error Handling
layout: tutorial
parent: Basics
nav_order: 5
permalink: /tutorial/basics/error-handling/
code_sample: |
  items[index] otherwise "Not found" where { items = ["a", "b", "c"], index = 10 }
---

# Error Handling with Otherwise
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Sometimes things go wrong - you try to access an array index that doesn't exist, divide by zero, or look up a missing key in a map. Melbi lets you handle these errors gracefully using the `otherwise` operator!

## Your first error handler

Let's try accessing an array element that doesn't exist:

```melbi
items[5] where { items = ["a", "b", "c"] }
```

This would give an error - the array only has 3 elements (indexes 0, 1, and 2).

But with `otherwise`, you can provide a fallback value:

```melbi
items[5] otherwise "Not found" where { items = ["a", "b", "c"] }
```

Now instead of an error, you get `"Not found"`!

## How it works

The `otherwise` operator has two parts:

```melbi
EXPRESSION otherwise FALLBACK_VALUE
```

- If `EXPRESSION` succeeds, you get its value
- If `EXPRESSION` fails (causes an error), you get `FALLBACK_VALUE` instead

Think of it as a safety net for your expressions!

## Safe array access

Arrays are a common source of errors when indexes are out of bounds:

```melbi
scores[student_id] otherwise 0 where {
  scores = [95, 87, 92],
  student_id = 10
}
```

Instead of crashing, this gives you `0` - a sensible default for a missing score.

```melbi
user_list[index] otherwise "Unknown" where {
  user_list = ["Alice", "Bob", "Charlie"],
  index = 5
}
```

Returns `"Unknown"` for any invalid index.

## Safe map lookups

Maps also benefit from `otherwise` when keys don't exist:

```melbi
prices[product] otherwise 0.0 where {
  prices = { "apple": 1.50, "banana": 0.75 },
  product = "grape"
}
```

Since "grape" isn't in the prices map, you get `0.0` instead of an error.

```melbi
translations[lang] otherwise "Hello" where {
  translations = {
    "es": "Hola",
    "fr": "Bonjour"
  },
  lang = "de"
}
```

German isn't in the translations, so it falls back to English "Hello".

## Division by zero

One of the most common programming errors:

```melbi
10 / 0 otherwise -1
```

Instead of crashing, this gives you `-1` to indicate an error occurred.

```melbi
total / count otherwise 0 where {
  total = 100,
  count = 0
}
```

Returns `0` when you can't calculate the average.

## Chaining with other operations

You can use `otherwise` as part of larger expressions:

```melbi
total where {
  prices = { "laptop": 999.99, "mouse": 25.99 },
  item = "keyboard",
  price = prices[item] otherwise 0.0,
  quantity = 2,
  total = price * quantity
}
```

If the item isn't in the prices map, the price is `0.0` and total becomes `0.0`.

## Practical examples

### User preferences with defaults

```melbi
theme where {
  preferences = { "language": "en", "notifications": true },
  theme = preferences["theme"] otherwise "light"
}
```

If the user hasn't set a theme preference, default to "light".

### Safe pagination

```melbi
current_page where {
  pages = ["Welcome", "About", "Contact", "Help"],
  page_num = 10,
  current_page = pages[page_num] otherwise pages[0]
}
```

If the page number is invalid, show the first page.

### Configuration with fallbacks

```melbi
timeout where {
  config = { "host": "api.example.com", "port": 443 },
  timeout = config["timeout"] otherwise 30
}
```

If timeout isn't configured, use 30 seconds as default.

### Graceful calculation errors

```melbi
result where {
  numerator = 100,
  denominator = 0,
  result = (numerator / denominator) otherwise -1
}
```

Handle division by zero without crashing.

## Multiple fallbacks

You can even chain `otherwise` operators:

```melbi
value where {
  options = {},
  value = options["primary"] otherwise options["secondary"] otherwise "default"
}
```

This tries to get "primary", if that fails tries "secondary", and if that fails uses "default".

## What errors does otherwise catch?

The `otherwise` operator catches **runtime errors** like:

- Array index out of bounds
- Map key doesn't exist  
- Division by zero
- Invalid type conversions (which you'll learn about later)
- Any operation that would normally cause an error

**What it doesn't catch:**

- Resource limits (running out of memory or time)
- Syntax errors (those are caught before your code runs)

## Real-world examples

### Email validation result

```melbi
status where {
  email = "user@example",
  has_at = ("@" in email),
  parts = email otherwise "",
  status = if has_at then "Valid" else "Invalid"
}
```

### Safe nested access

```melbi
city where {
  users = {
    "alice": { name = "Alice", address = { city = "NYC" } }
  },
  user_id = "bob",
  user = users[user_id] otherwise { name = "Guest", address = { city = "Unknown" } },
  city = user.address.city
}
```

### Price calculation with safety

```melbi
unit_price where {
  total = 100,
  quantity = 0,
  unit_price = (total / quantity) otherwise 0.0
}
```

### Game score lookup

```melbi
high_score where {
  scores = { "alice": 1000, "bob": 1500 },
  player = "charlie",
  high_score = scores[player] otherwise 0
}
```

## Best practices

1. **Use descriptive fallbacks** - Choose fallback values that make sense in context (`0` for numbers, `""` for strings, `false` for booleans)

2. **Don't hide real bugs** - Use `otherwise` for expected errors (like missing optional data), not to paper over bugs

3. **Consider checking first** - Sometimes it's better to use `in` to check before accessing:
   ```melbi
   if "key" in map then map["key"] else default_value
   ```

4. **Document your fallbacks** - Make it clear why you chose that fallback value

## Try it yourself!

Create expressions that:

1. Safe array access that returns -1 for missing elements
2. Look up a country code in a map with "Unknown" as fallback
3. Calculate percentage with division by zero protection
4. Access nested record fields safely
5. Build a multi-level fallback for configuration values

Now you know how to handle errors gracefully! Your Melbi expressions can be robust and won't crash when unexpected things happen.

Next, you'll learn about **Options** - Melbi's way of representing values that might or might not exist!
