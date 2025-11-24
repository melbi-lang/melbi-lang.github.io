---
title: Type Casting
layout: tutorial
parent: Type Safety
nav_order: 3
permalink: /tutorial/type-safety/type-casting/
code_sample: |
  result as Float where { result = 42 as Float }
---

# Type Casting
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

Remember how Melbi won't let you mix integers and floats? That's by design - it prevents subtle bugs. But sometimes you *do* need to convert between types. That's where **type casting** comes in!

## The problem

This doesn't work:

```melbi
1 + 1.5
```

Error! Can't add an integer and a float.

But with type casting:

```melbi
(1 as Float) + 1.5
```

Now it works! Result: `2.5`

## The as keyword

Type casting uses the `as` keyword:

```melbi
VALUE as TYPE
```

This explicitly converts `VALUE` to the specified `TYPE`.

## Integer to Float

The most common conversion:

```melbi
42 as Float
```

Result: `42.0`

```melbi
(10 as Float) / 3.0
```

Result: `3.333...` (not `3`!)

```melbi
total where {
  int_value = 100,
  float_value = 3.14,
  total = (int_value as Float) + float_value
}
```

Result: `103.14`

## Float to Integer

Converting the other direction drops the decimal part:

```melbi
3.14 as Int
```

Result: `3` (not rounded, just truncated!)

```melbi
9.99 as Int
```

Result: `9`

```melbi
-2.7 as Int
```

Result: `-2`

**Important:** This truncates (cuts off the decimal), it doesn't round!

## Why explicit casting?

Melbi could automatically convert types, but that leads to bugs:

```melbi
10 / 3
```

If this automatically converted to float, you'd get `3.333...` when you might have wanted `3`.

By forcing you to be explicit:

```melbi
10 / 3
```

This is `3` (integer division).

```melbi
(10 as Float) / 3.0
```

This is `3.333...` (float division).

You say exactly what you mean!

## Practical examples

### Average calculation

```melbi
average where {
  total = 287,
  count = 3,
  average = (total as Float) / (count as Float)
}
```

Result: `95.666...`

Without casting, you'd get `95` (integer division).

### Percentage

```melbi
percentage where {
  completed = 7,
  total = 10,
  percentage = ((completed as Float) / (total as Float)) * 100.0
}
```

Result: `70.0`

### Price calculation

```melbi
unit_price where {
  total_cost = 100,
  quantity = 3,
  unit_price = (total_cost as Float) / (quantity as Float)
}
```

Result: `33.333...`

### Rounding with truncation

```melbi
rounded where {
  value = 3.7,
  rounded = (value + 0.5) as Int
}
```

Result: `4` (a simple rounding trick!)

## Casting in expressions

You can cast any expression:

```melbi
((10 + 5) as Float) / 2.0
```

```melbi
((price * quantity) as Float) / 100.0 where {
  price = 25,
  quantity = 4
}
```

## Multiple conversions

Sometimes you need to convert back and forth:

```melbi
result where {
  int_value = 42,
  float_calc = (int_value as Float) * 1.5,
  back_to_int = float_calc as Int
}
```

Result: `63` (42 × 1.5 = 63.0, then truncated to 63)

## Real-world examples

### Tax calculation

```melbi
tax where {
  subtotal = 100,
  tax_rate = 0.08,
  tax = ((subtotal as Float) * tax_rate) as Int
}
```

This calculates tax as a float, then converts to cents (integer).

### Score percentage

```melbi
percentage where {
  correct = 17,
  total = 20,
  percentage = f"{((correct as Float) / (total as Float)) * 100.0}%"
}
```

Result: `"85.0%"`

### Time conversion

```melbi
hours where {
  total_minutes = 150,
  hours = total_minutes / 60,
  remaining_minutes = total_minutes - (hours * 60)
}
```

This uses integer division to get whole hours.

### Rating calculation

```melbi
average_rating where {
  total_stars = 47,
  num_ratings = 10,
  average_rating = (total_stars as Float) / (num_ratings as Float)
}
```

Result: `4.7`

## Type casting with otherwise

Casting can fail! Protect yourself:

```melbi
(value as Int) otherwise 0 where { value = 3.14 }
```

If the cast succeeds, you get the integer. If it fails, you get the fallback.

```melbi
safe_int where {
  maybe_number = "not a number",
  safe_int = (maybe_number as Int) otherwise -1
}
```

## Common patterns

### Safe division with float result

```melbi
safe_divide where {
  numerator = 10,
  denominator = 3,
  safe_divide = if denominator != 0 
    then (numerator as Float) / (denominator as Float)
    else 0.0
}
```

### Integer percentage

```melbi
percent where {
  part = 3,
  whole = 4,
  percent = (((part as Float) / (whole as Float)) * 100.0) as Int
}
```

Result: `75` (integer percentage)

### Price formatting

```melbi
price_display where {
  cents = 1299,
  dollars = (cents as Float) / 100.0,
  price_display = f"${dollars}"
}
```

Result: `"$12.99"`

## Type safety matters

Without type casting:

```melbi
10 / 3
```

Result: `3` (integer division, no decimal)

With type casting:

```melbi
(10 as Float) / (3 as Float)
```

Result: `3.333...` (float division, with decimal)

Melbi makes you choose explicitly, preventing:
- Accidental integer division when you wanted precision
- Accidental float conversion when you wanted truncation
- Silent type coercion bugs

## Tips and best practices

1. **Be explicit** - Even when it seems obvious, cast for clarity

2. **Cast early** - Convert at the start of calculations:
   ```melbi
   total where {
     a = 10 as Float,
     b = 20 as Float,
     total = a + b  // Now both are floats
   }
   ```

3. **Remember truncation** - Float to Int doesn't round!
   ```melbi
   3.9 as Int  // gives 3, not 4!
   ```

4. **Use otherwise** - Protect against cast failures:
   ```melbi
   (input as Int) otherwise 0
   ```

5. **Document why** - Make it clear why you're casting:
   ```melbi
   average where {
     sum = 100,
     count = 3,
     // Cast to float for decimal precision
     average = (sum as Float) / (count as Float)
   }
   ```

## Try it yourself!

Create expressions that:

1. Calculate miles per gallon from integers
2. Convert temperature from integer Celsius to float Fahrenheit
3. Calculate compound interest with integer principal
4. Find the average of integer test scores with decimal result
5. Calculate percentage with integer result (truncated, not rounded)

Congratulations! You've completed the Type Safety section. You now understand:
- **Options** - Handling values that might not exist
- **Pattern Matching** - Elegantly handling different cases
- **Type Casting** - Explicitly converting between types

These features make Melbi expressions safe, explicit, and bug-resistant!

Next up: **Functions** - creating reusable logic with lambdas!
