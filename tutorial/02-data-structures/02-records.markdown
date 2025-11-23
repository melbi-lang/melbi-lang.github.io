---
title: Records
layout: tutorial
parent: Data Structures
nav_order: 2
permalink: /tutorial/data-structures/records/
code_sample: |
  user.name where { user = { name = "Alice", age = 30, active = true } }
---

# Records
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Arrays let you store multiple values, but you have to remember what each position means. Is `person[0]` the name or the age? Records solve this by letting you name each value!

## Your first record

A record is a collection of named values (called fields) wrapped in curly braces:

```melbi
{ name = "Alice", age = 30 }
```

Much clearer than `["Alice", 30]`, right?

## Accessing fields

Use a dot to access fields by name:

```melbi
person.name where { person = { name = "Alice", age = 30 } }
```

This gives you `"Alice"`.

```melbi
person.age where { person = { name = "Alice", age = 30 } }
```

This gives you `30`.

No need to remember positions - just use the field name!

## Empty records

You can create an empty record:

```melbi
Record{}
```

Though this isn't very useful on its own.

## Fields can be any type

Records can mix different types in their fields (unlike arrays!):

```melbi
{
  name = "Bob",
  age = 25,
  score = 95.5,
  active = true
}
```

Here we have a string, two numbers, and a boolean all in one record.

## Nested records

Records can contain other records:

```melbi
{
  name = "Alice",
  address = {
    street = "123 Main St",
    city = "Springfield",
    zip = "12345"
  }
}
```

Access nested fields with multiple dots:

```melbi
person.address.city where {
  person = {
    name = "Alice",
    address = {
      street = "123 Main St",
      city = "Springfield"
    }
  }
}
```

This gives you `"Springfield"`.

## Records in where bindings

Records work beautifully with where bindings:

```melbi
greeting where {
  user = { name = "Alice", role = "admin" },
  greeting = f"Hello, {user.name}! You are an {user.role}."
}
```

```melbi
total where {
  item = { name = "Widget", price = 29.99, quantity = 3 },
  total = item.price * item.quantity
}
```

## Practical examples

### User profile

```melbi
display_name where {
  user = {
    first_name = "John",
    last_name = "Doe",
    username = "johnd",
    email = "john@example.com"
  },
  display_name = f"{user.first_name} {user.last_name} (@{user.username})"
}
```

### Product information

```melbi
description where {
  product = {
    name = "Laptop",
    brand = "TechCorp",
    price = 999.99,
    in_stock = true
  },
  status = if product.in_stock then "Available" else "Out of stock",
  description = f"{product.brand} {product.name} - ${product.price} - {status}"
}
```

### Configuration settings

```melbi
full_url where {
  config = {
    host = "api.example.com",
    port = 443,
    use_ssl = true,
    api_version = "v2"
  },
  protocol = if config.use_ssl then "https" else "http",
  full_url = f"{protocol}://{config.host}:{config.port}/{config.api_version}"
}
```

### Coordinate with metadata

```melbi
distance_info where {
  location = {
    x = 10,
    y = 20,
    label = "Home",
    visited = true
  },
  distance = (location.x ^ 2 + location.y ^ 2) ^ 0.5,
  distance_info = f"{location.label}: {distance} units away"
}
```

## Arrays of records

You can have arrays where each element is a record:

```melbi
first_user.name where {
  users = [
    { name = "Alice", age = 30 },
    { name = "Bob", age = 25 },
    { name = "Charlie", age = 35 }
  ],
  first_user = users[0]
}
```

Or access directly:

```melbi
users[1].age where {
  users = [
    { name = "Alice", age = 30 },
    { name = "Bob", age = 25 }
  ]
}
```

This gives you `25` - Bob's age.

## Records with arrays

Records can have arrays as field values:

```melbi
first_score where {
  student = {
    name = "Alice",
    scores = [95, 87, 92],
    enrolled = true
  },
  first_score = student.scores[0]
}
```

```melbi
colors.primary[0] where {
  colors = {
    primary = ["#FF0000", "#00FF00", "#0000FF"],
    secondary = ["#FFFF00", "#FF00FF", "#00FFFF"]
  }
}
```

## Real-world examples

### Form validation

```melbi
is_valid where {
  form = {
    email = "user@example.com",
    age = 25,
    agreed = true
  },
  has_email = "@" in form.email,
  old_enough = form.age >= 18,
  is_valid = has_email and old_enough and form.agreed
}
```

### Invoice calculation

```melbi
invoice_total where {
  invoice = {
    subtotal = 100.00,
    tax_rate = 0.08,
    shipping = 10.00,
    discount = 5.00
  },
  tax = invoice.subtotal * invoice.tax_rate,
  invoice_total = invoice.subtotal + tax + invoice.shipping - invoice.discount
}
```

### Game character

```melbi
can_level_up where {
  character = {
    name = "Hero",
    level = 5,
    xp = 1000,
    xp_required = 1000,
    gold = 500
  },
  can_level_up = character.xp >= character.xp_required
}
```

### API response

```melbi
message where {
  response = {
    status = 200,
    success = true,
    data = {
      user_id = 12345,
      username = "alice"
    },
    timestamp = "2024-11-23T10:30:00Z"
  },
  message = if response.success 
    then f"User {response.data.username} logged in"
    else "Login failed"
}
```

## Important notes

1. Field names must start with a lowercase letter
2. Fields can be any type - numbers, strings, booleans, arrays, even other records
3. Unlike arrays, records can mix different types
4. You can't have duplicate field names
5. Records are immutable - you can't change fields after creation

## Try it yourself!

Create expressions that:

1. Build a book record with title, author, and year, then format it nicely
2. Create a rectangle record with width and height, calculate its area
3. Make a contact record with name, email, and phone, check if email is valid
4. Build a shopping cart with items (array of records) and calculate total
5. Create a config record for an app and generate a connection string

In the next lesson, you'll learn about **maps** - records where you can use any value as a key!
