---
title: Arrays
layout: tutorial
parent: Data Structures
nav_order: 1
permalink: /tutorial/data-structures/arrays/
code_sample: |
  scores[0] where { scores = [95, 87, 92, 78, 88] }
---

# Arrays
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

So far you've worked with single values - one number, one string, one boolean. But what if you need to work with a collection of values? That's where arrays come in!

## Your first array

An array is a list of values wrapped in square brackets:

```melbi
[1, 2, 3, 4, 5]
```

```melbi
["apple", "banana", "cherry"]
```

```melbi
[true, false, true]
```

That's it! You now have a collection of values.

## Empty arrays

You can create an empty array with just the brackets:

```melbi
[]
```

This is useful as a starting point or to represent "no items."

## Accessing elements

Get individual elements using their position (index). Arrays start counting at 0:

```melbi
fruits[0] where { fruits = ["apple", "banana", "cherry"] }
```

This gives you `"apple"` - the first element.

```melbi
fruits[1] where { fruits = ["apple", "banana", "cherry"] }
```

This gives you `"banana"` - the second element.

```melbi
fruits[2] where { fruits = ["apple", "banana", "cherry"] }
```

This gives you `"cherry"` - the third element.

Remember: computers start counting at 0, so the first element is at index 0!

## Using with where bindings

Arrays work great with where bindings:

```melbi
best_score where {
  scores = [95, 87, 92, 78, 88],
  best_score = scores[0]
}
```

```melbi
message where {
  names = ["Alice", "Bob", "Charlie"],
  first = names[0],
  last = names[2],
  message = f"{first} and {last} are here"
}
```

## Arrays of any type

Arrays can hold numbers, strings, booleans, or even other arrays!

### Numbers

```melbi
[1, 2, 3, 4, 5]
```

```melbi
[3.14, 2.71, 1.41]
```

### Strings

```melbi
["red", "green", "blue"]
```

```melbi
["user@example.com", "admin@site.com"]
```

### Booleans

```melbi
[true, false, true, true]
```

### Mixed? No!

Here's an important rule: all elements in an array must be the same type. You can't mix numbers and strings:

```melbi
[1, "two", 3]
```

This would give an error. Melbi is strict about types to catch mistakes early!

## Nested arrays

Arrays can contain other arrays:

```melbi
[[1, 2], [3, 4], [5, 6]]
```

Access nested elements with multiple brackets:

```melbi
grid[0][1] where {
  grid = [[1, 2], [3, 4], [5, 6]]
}
```

This gives you `2` - the second element of the first array.

Think of it like a spreadsheet - `grid[0]` gets you the first row, then `[1]` gets you the second column.

## Practical examples

### Test scores

```melbi
average where {
  scores = [95, 87, 92, 78, 88],
  total = scores[0] + scores[1] + scores[2] + scores[3] + scores[4],
  count = 5,
  average = total / count
}
```

### Email list

```melbi
f"Sending to: {emails[0]}, {emails[1]}, and {emails[2]}" where {
  emails = ["alice@example.com", "bob@example.com", "charlie@example.com"]
}
```

### Days of the week

```melbi
today where {
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  day_index = 3,
  today = days[day_index]
}
```

### Color palettes

```melbi
primary_color where {
  palette = ["#FF5733", "#33FF57", "#3357FF", "#F333FF"],
  primary_color = palette[0]
}
```

## Array expressions

You can build arrays using expressions:

```melbi
[1 + 1, 2 * 2, 3 - 1]
```

This evaluates to `[2, 4, 2]`.

```melbi
[price * 1.1, price * 0.9] where { price = 100 }
```

This gives you `[110.0, 90.0]` - 10% above and below the price.

## Using the `in` operator

Check if a value exists in an array:

```melbi
5 in [1, 2, 3, 4, 5]
```

This is `true` - 5 is in the array.

```melbi
"cat" in ["dog", "bird", "fish"]
```

This is `false` - "cat" is not in that array.

Perfect for checking permissions, valid options, or blacklists:

```melbi
if role in admin_roles then "Access granted" else "Access denied"
where {
  role = "moderator",
  admin_roles = ["admin", "super_admin", "moderator"]
}
```

```melbi
if extension in allowed then "Upload accepted" else "Invalid file type"
where {
  extension = ".jpg",
  allowed = [".jpg", ".png", ".gif", ".webp"]
}
```

## Real-world examples

### Menu selection

```melbi
selected_item where {
  menu = ["New", "Open", "Save", "Exit"],
  choice = 2,
  selected_item = menu[choice]
}
```

### Price tiers

```melbi
price where {
  tiers = [9.99, 19.99, 49.99, 99.99],
  tier_index = 1,
  price = tiers[tier_index]
}
```

### Status codes

```melbi
is_success where {
  success_codes = [200, 201, 204],
  response_code = 200,
  is_success = response_code in success_codes
}
```

### Coordinates

```melbi
distance where {
  point1 = [0, 0],
  point2 = [3, 4],
  dx = point2[0] - point1[0],
  dy = point2[1] - point1[1],
  distance = (dx ^ 2 + dy ^ 2) ^ 0.5
}
```

## Important notes

1. Arrays are **zero-indexed** - the first element is at position 0
2. All elements must be the **same type** - no mixing numbers and strings
3. Arrays are **immutable** - you can't change them after creation (but you can create new ones!)
4. Accessing an index that doesn't exist gives an error - but you can handle these errors gracefully with `otherwise` (you'll learn how later!)

## Try it yourself!

Create expressions that:

1. Store the RGB values for a color and calculate the average
2. Create a shopping list and check if an item is in it
3. Store coordinates for a route and calculate distances
4. Make an array of prices and find the most expensive (hint: compare them!)
5. Build a tic-tac-toe board using nested arrays

In the next lesson, you'll learn about **records** - a way to group related values with names!
