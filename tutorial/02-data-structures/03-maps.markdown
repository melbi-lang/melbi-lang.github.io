---
title: Maps
layout: tutorial
parent: Data Structures
nav_order: 3
permalink: /tutorial/data-structures/maps/
code_sample: |
  prices[product] where { prices = { "apple": 1.50, "banana": 0.75 }, product = "apple" }
---

# Maps
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Records are great when you know the field names ahead of time. But what if you need to look up values dynamically? That's where **maps** come in!

## What's the difference?

Let's compare:

**Record** - Field names are part of the code:
```melbi
config.timeout
```

**Map** - Keys can be variables or expressions:
```melbi
prices[product_name]
```

Records use dot notation (`.`), maps use brackets (`[]`) like arrays.

## Your first map

Maps look similar to records, but use colons (`:`) instead of equals signs (`=`):

```melbi
{ "apple": 1.50, "banana": 0.75, "orange": 1.25 }
```

Access values using brackets:

```melbi
prices["apple"] where {
  prices = { "apple": 1.50, "banana": 0.75, "orange": 1.25 }
}
```

This gives you `1.50`.

## Empty maps

An empty map uses curly braces with nothing inside:

```melbi
{}
```

This is different from an empty record, which is written as `Record{}`.

Melbi distinguishes between them so you know exactly what you're working with!

## Dynamic lookups

The real power of maps is looking up values dynamically:

```melbi
prices[fruit] where {
  prices = { "apple": 1.50, "banana": 0.75, "orange": 1.25 },
  fruit = "banana"
}
```

This gives you `0.75` - we're using a variable to look up the price!

With a record, you'd have to know the field name at the time you write the code. With a map, you can decide at runtime.

## Different key types

Maps can use different types as keys:

### String keys (most common)

```melbi
{
  "en": "Hello",
  "es": "Hola",
  "fr": "Bonjour"
}
```

### Number keys

```melbi
{
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday"
}
```

```melbi
{
  404: "Not Found",
  500: "Server Error",
  200: "OK"
}
```

### But all keys must be the same type!

You can't mix string and number keys in the same map.

## Checking if a key exists

Use the `in` operator:

```melbi
"apple" in prices where {
  prices = { "apple": 1.50, "banana": 0.75 }
}
```

This is `true` - "apple" is a key in the map.

```melbi
"grape" in prices where {
  prices = { "apple": 1.50, "banana": 0.75 }
}
```

This is `false` - "grape" is not in the map.

Perfect for checking if something is valid or available!

**Note:** If you try to access a key that doesn't exist, you'll get an error. But don't worry - you can handle these errors gracefully using `otherwise` (you'll learn how later!).

## Practical examples

### Product catalog

```melbi
total where {
  prices = {
    "laptop": 999.99,
    "mouse": 25.99,
    "keyboard": 79.99
  },
  item = "laptop",
  quantity = 2,
  total = prices[item] * quantity
}
```

### Language translations

```melbi
translations[lang] where {
  translations = {
    "en": "Welcome",
    "es": "Bienvenido",
    "fr": "Bienvenue",
    "de": "Willkommen"
  },
  lang = "es"
}
```

### HTTP status messages

```melbi
message where {
  status_messages = {
    200: "Success",
    404: "Not Found",
    500: "Server Error",
    403: "Forbidden"
  },
  status_code = 404,
  message = status_messages[status_code]
}
```

### User roles and permissions

```melbi
permission_level where {
  permissions = {
    "admin": 100,
    "moderator": 50,
    "user": 10,
    "guest": 1
  },
  role = "moderator",
  permission_level = permissions[role]
}
```

## Maps with complex values

Map values can be any type - numbers, strings, arrays, records, or even other maps!

### Maps of arrays

```melbi
categories["fruits"] where {
  categories = {
    "fruits": ["apple", "banana", "orange"],
    "vegetables": ["carrot", "broccoli", "spinach"],
    "dairy": ["milk", "cheese", "yogurt"]
  }
}
```

### Maps of records

```melbi
users["alice"].email where {
  users = {
    "alice": { name = "Alice", email = "alice@example.com", age = 30 },
    "bob": { name = "Bob", email = "bob@example.com", age = 25 }
  }
}
```

### Nested maps

```melbi
config["database"]["host"] where {
  config = {
    "database": {
      "host": "localhost",
      "port": 5432
    },
    "cache": {
      "host": "redis",
      "port": 6379
    }
  }
}
```

## Real-world examples

### Price calculator with lookup

```melbi
total where {
  prices = {
    "small": 10.00,
    "medium": 15.00,
    "large": 20.00,
    "xlarge": 25.00
  },
  selected_size = "medium",
  quantity = 3,
  total = prices[selected_size] * quantity
}
```

### Country codes

```melbi
country_name where {
  countries = {
    "US": "United States",
    "CA": "Canada",
    "MX": "Mexico",
    "UK": "United Kingdom"
  },
  code = "CA",
  country_name = countries[code]
}
```

### Configuration by environment

```melbi
config[env] where {
  config = {
    "development": {
      debug = true,
      api_url = "http://localhost:3000"
    },
    "production": {
      debug = false,
      api_url = "https://api.example.com"
    }
  },
  env = "production"
}
```

### Grade calculations

```melbi
message where {
  grade_thresholds = {
    "A": 90,
    "B": 80,
    "C": 70,
    "D": 60
  },
  score = 85,
  passed_b = score >= grade_thresholds["B"],
  message = if passed_b then "Good job!" else "Keep trying!"
}
```

## When to use maps vs records

**Use records when:**
- You know all the field names when writing the code
- Field names are fixed (like `user.name`, `config.timeout`)
- You want dot notation for clarity

**Use maps when:**
- Keys come from user input or data
- You need to look up values dynamically
- Keys might be numbers
- You're building dictionaries or lookup tables

## Try it yourself!

Create expressions that:

1. Build a phonebook map and look up someone's number
2. Create a currency converter with exchange rates
3. Make a map of error codes to messages, look one up
4. Build a scoring system for a game with different actions
5. Create a menu system with prices, calculate an order total

Congratulations! You've completed the Data Structures section. You now know how to work with:
- **Arrays** - ordered collections of same-type values
- **Records** - named collections with different types
- **Maps** - dynamic key-value lookups

Next, you'll learn about Melbi's type safety features, including Options and pattern matching!
