---
title: Conditionals
layout: tutorial
parent: Basics
nav_order: 4
permalink: /tutorial/basics/conditionals/
code_sample: |
  if temperature > 30 then "Hot" else "Not hot" where { temperature = 35 }
---

# Conditionals
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

So far, every expression you've written evaluates to a single value. But what if you need different results depending on some condition? That's where `if-then-else` comes in!

## Your first conditional

```melbi
if true then "yes" else "no"
```

This evaluates to `"yes"` because the condition is `true`.

```melbi
if false then "yes" else "no"
```

This evaluates to `"no"` because the condition is `false`.

## The structure

Every `if` expression has three parts:

```melbi
if CONDITION then VALUE_IF_TRUE else VALUE_IF_FALSE
```

All three parts are required. Melbi doesn't allow "dangling ifs" - you must always specify what happens in both cases.

## Comparison operators

To make real decisions, you need to compare values:

### Equality

```melbi
if 5 == 5 then "equal" else "not equal"
```

```melbi
if 3 == 7 then "equal" else "not equal"
```

### Not equal

```melbi
if 5 != 3 then "different" else "same"
```

### Greater than and less than

```melbi
if 10 > 5 then "bigger" else "smaller or equal"
```

```melbi
if 3 < 8 then "smaller" else "bigger or equal"
```

### Greater than or equal, less than or equal

```melbi
if 5 >= 5 then "yes" else "no"
```

```melbi
if 10 <= 8 then "yes" else "no"
```

## Practical examples

### Temperature warning

```melbi
if temperature > 30 then "It's hot!" else "Nice weather" 
where { temperature = 35 }
```

### Discount eligibility

```melbi
if purchase_amount >= 100 then "Free shipping!" else "Standard shipping"
where { purchase_amount = 150 }
```

### Pass/fail grade

```melbi
if score >= 70 then "Pass" else "Fail"
where { score = 85 }
```

## Combining with where bindings

You can use where bindings to organize your conditional logic:

```melbi
message where {
  age = 16,
  can_drive = age >= 16,
  message = if can_drive then "You can drive!" else "Too young to drive"
}
```

Or put the condition directly in the if:

```melbi
if age >= 18 then "Adult" else "Minor"
where { age = 21 }
```

## Logical operators

Combine multiple conditions with `and`, `or`, and `not`:

### AND - both must be true

```melbi
if age >= 18 and has_license then "Can drive" else "Cannot drive"
where { age = 20, has_license = true }
```

### OR - at least one must be true

```melbi
if is_weekend or is_holiday then "Day off!" else "Work day"
where { is_weekend = false, is_holiday = true }
```

### NOT - flip the condition

```melbi
if not is_raining then "Go outside" else "Stay inside"
where { is_raining = false }
```

## Nested conditionals

You can nest `if` expressions inside each other:

```melbi
if age < 13 then "Child"
else if age < 20 then "Teenager"
else if age < 65 then "Adult"
else "Senior"
where { age = 35 }
```

Note: This is actually `if ... then ... else (if ... then ... else (...))` - each `else` contains another `if`.

## Comparing strings

You can compare strings too:

```melbi
if name == "Alice" then "Hello Alice!" else "Hello stranger!"
where { name = "Alice" }
```

```melbi
if status != "active" then "Account inactive" else "Welcome back!"
where { status = "suspended" }
```

## Checking membership

Use `in` to check if something is contained:

```melbi
if "error" in log_message then "Alert!" else "All good"
where { log_message = "error: connection timeout" }
```

```melbi
if "@gmail.com" in email then "Gmail user" else "Other email"
where { email = "user@gmail.com" }
```

Use `not in` for the opposite:

```melbi
if "spam" not in subject then "Show email" else "Move to spam"
where { subject = "Important meeting" }
```

## Real-world examples

### Email filtering

```melbi
if "urgent" in subject or sender == "boss@company.com" 
then "Priority inbox" 
else "Regular inbox"
where {
  subject = "Urgent: Project deadline",
  sender = "colleague@company.com"
}
```

### Pricing logic

```melbi
final_price where {
  base_price = 50,
  is_member = true,
  quantity = 10,
  discount = if is_member and quantity >= 10 then 0.15 else 0.05,
  final_price = base_price * quantity * (1 - discount)
}
```

### Access control

```melbi
if role == "admin" or (role == "moderator" and is_owner)
then "Full access"
else "Read only"
where {
  role = "moderator",
  is_owner = true
}
```

### Form validation

```melbi
if age >= 18 and email_valid and agreed_to_terms
then "Registration successful"
else "Please complete all requirements"
where {
  age = 25,
  email_valid = true,
  agreed_to_terms = true
}
```

## Important notes

1. Both branches (then and else) must return the same type - you can't have `if x then 5 else "hello"`. This prevents type errors.

2. The condition must be a boolean (`true` or `false`) - you can't use numbers or strings directly as conditions.

3. You must always have an `else` - Melbi requires you to handle both cases explicitly.

## Try it yourself!

Write expressions that:

1. Check if a number is positive, negative, or zero
2. Determine shipping cost based on purchase amount
3. Convert a numeric grade to a letter grade (A, B, C, D, F)
4. Check if a password meets requirements (length, has numbers, etc.)
5. Calculate parking fees based on hours parked and day of week

Congratulations! You've completed the Basics section. You now know how to:
- Perform calculations
- Use variables with where bindings
- Work with text
- Make decisions with conditionals

Next, you'll learn about working with collections of data like arrays, records, and maps!
