---
title: Strings and Format Strings
layout: tutorial
parent: Basics
nav_order: 3
permalink: /tutorial/basics/strings/
code_sample: |
  f"Hello {name}!" where { name = "Alice" }
---

# Strings and Format Strings
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Numbers are great, but most programs need to work with text too. In Melbi, text values are called **strings**.

## Basic strings

Create a string by wrapping text in double quotes:

```melbi
"Hello, world!"
```

Or single quotes:

```melbi
'Hello, world!'
```

Both work the same way. Use whichever you prefer (or whichever lets you avoid escaping quotes inside your string).

## Strings with quotes inside

If your string contains quotes, you have two options:

Use the other kind of quote:

```melbi
"It's a beautiful day"
```

```melbi
'She said "Hello!"'
```

Or escape them with a backslash:

```melbi
"She said \"Hello!\""
```

```melbi
'It\'s a beautiful day'
```

## Escape sequences

Use backslashes to include special characters:

```melbi
"Line 1\nLine 2"
```

This creates a string with a newline between the two lines.

Common escape sequences:
- `\n` - newline
- `\t` - tab
- `\\` - backslash itself
- `\"` - double quote
- `\'` - single quote
- `\0` - null character

## String operations

### Combining strings

{: .highlight }
> This feature is not available yet, but is planned.

In the future, you'll be able to combine strings with an operator (likely `++`):
```melbi
"Hello, " ++ "world!"
```

For now, use format strings to combine text:
```melbi
f"{greeting}{name}" where {
  greeting = "Hello, ",
  name = "Bob"
}
```

### Checking if text contains something

```melbi
"hello" in "hello world"
```

This evaluates to `true` - "hello" is found in "hello world".

```melbi
"goodbye" in "hello world"
```

This is `false` - "goodbye" is not in that string.

The `in` operator is perfect for checking if an email contains certain words, if a filename has an extension, or if a message contains profanity.

## Format strings - The powerful way

Instead of manually concatenating strings, use **format strings**. They start with `f` and let you embed expressions directly:

```melbi
f"Hello {name}!" where { name = "Alice" }
```

This evaluates to: `"Hello Alice!"`

The part in curly braces `{name}` is replaced with the value of `name`.

### Embedding calculations

You can put any expression inside the braces:

```melbi
f"2 + 2 = {2 + 2}"
```

Result: `"2 + 2 = 4"`

```melbi
f"The total is ${price * quantity}" where {
  price = 29.99,
  quantity = 3
}
```

Result: `"The total is $89.97"`

### Multiple values

```melbi
f"{greeting}, {name}! You have {count} new messages." where {
  greeting = "Hello",
  name = "Alice",
  count = 5
}
```

Result: `"Hello, Alice! You have 5 new messages."`

### Complex expressions

```melbi
f"Your score is {score * 100}%" where { score = 0.95 }
```

```melbi
f"Tax: ${price * tax_rate}" where {
  price = 100,
  tax_rate = 0.08
}
```

## Literal braces

What if you need actual curly braces in your string? Use double braces:

```melbi
f"Use {{curly braces}} like this"
```

Result: `"Use {curly braces} like this"`

## Practical examples

### User notifications

```melbi
f"Hi {user}! Your order #{order_id} will arrive on {delivery_date}." where {
  user = "John",
  order_id = 12345,
  delivery_date = "Monday"
}
```

### Email subject lines

```melbi
f"[{status}] Ticket #{ticket}: {title}" where {
  status = "RESOLVED",
  ticket = 4567,
  title = "Login issue"
}
```

### Status messages

```melbi
f"Processing {current} of {total} items ({percentage}% complete)" where {
  current = 7,
  total = 10,
  percentage = (current * 100) / total
}
```

### Log messages

```melbi
f"{timestamp} - {level}: {message}" where {
  timestamp = "2024-11-23 10:30:00",
  level = "ERROR",
  message = "Connection timeout"
}
```

## Unicode support

Melbi strings fully support Unicode, so you can use emoji, accented characters, and text from any language:

```melbi
"Hello 世界! 🌍"
```

```melbi
"café"
```

```melbi
f"Math: π ≈ {pi}" where { pi = 3.14159 }
```

## Try it yourself!

Create expressions that:

1. Build a full name from first and last name
2. Create an email address from username and domain
3. Format a price with dollar sign and two decimal places
4. Build a welcome message with someone's name and the time of day
5. Create a filename with a timestamp

In the next lesson, you'll learn how to make decisions with conditionals!
