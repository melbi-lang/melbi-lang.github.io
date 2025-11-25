---
title: Cross-field Validation
layout: tutorial
parent: Examples
nav_order: 3
permalink: /tutorial/examples/cross-field-validation/
code_sample: |
  form.password == form.confirm
  where {
      form = { password = "secret123", confirm = "secret123" },
  }
---

# Cross-field Validation
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

Cross-field validation checks relationships *between* fields rather than individual field formats. This is something regex can't do—you need to compare values, check ranges, and enforce dependencies between fields.

## Password confirmation

Ensuring two fields have the same value:

```melbi
form.password == form.confirm
where {
    form = { password = "secret123", confirm = "secret123" },
}
```

Result: `true`

Simple equality check—the password and confirmation must match exactly.

## Date range validation

Ensuring a start date comes before an end date:

```melbi
booking.start_day < booking.end_day
where {
    booking = { start_day = 15, end_day = 20, month = "June" },
}
```

Result: `true`

You can't check this with regex—it requires comparing numeric values.

## Budget constraint

Checking that a calculated total doesn't exceed a limit:

```melbi
total <= order.budget
where {
    order = { quantity = 5, unit_price = 19.99, budget = 100.0 },
    total = (order.quantity as Float) * order.unit_price,
}
```

Result: `true`

The total is $99.95, which is within the $100 budget.

## At least one required

Ensuring at least one of several optional fields is provided:

```melbi
has_email or has_phone or has_address
where {
    user = { email = some "user@example.com", phone = none, address = none },
    has_email = user.email match { some _ -> true, none -> false },
    has_phone = user.phone match { some _ -> true, none -> false },
    has_address = user.address match { some _ -> true, none -> false },
}
```

Result: `true`

The user provided an email, so the validation passes even though phone and address are empty.

## Dependent fields

When one field's value determines whether another is required:

```melbi
if order.needs_shipping
    then order.shipping_address match { some _ -> true, none -> false }
    else true
where {
    order = {
        needs_shipping = true,
        shipping_address = some "123 Main St",
    },
}
```

Result: `true`

If shipping is needed, there must be an address. If no shipping is needed, the address doesn't matter.

## Age with parental consent

Complex validation where multiple conditions can satisfy the requirement:

```melbi
registration.age >= 18 or registration.has_parent_consent
where {
    registration = {
        age = 16,
        has_parent_consent = true,
        country = "US",
    },
}
```

Result: `true`

Users under 18 can register if they have parental consent.

## Quantity limits

Enforcing minimum and maximum values:

```melbi
item.quantity >= item.min_order and item.quantity <= item.max_order
where {
    item = { quantity = 5, min_order = 1, max_order = 10 },
}
```

Result: `true`

The quantity of 5 is between the minimum (1) and maximum (10).

## Combining validations

Real forms often need multiple validation rules:

```melbi
{
    passwords_match = form.password == form.confirm,
    password_long_enough = String.Len(form.password) >= 8,
    age_valid = form.age >= 13,
    all_valid = passwords_match and password_long_enough and age_valid,
}
where {
    form = {
        password = "secret123",
        confirm = "secret123",
        age = 25,
    },
    passwords_match = form.password == form.confirm,
    password_long_enough = String.Len(form.password) >= 8,
    age_valid = form.age >= 13,
}
```

Result: `{ passwords_match = true, password_long_enough = true, age_valid = true, all_valid = true }`

This returns individual validation results plus an overall `all_valid` flag.

## Why cross-field validation in Melbi?

These validations require comparing and computing across multiple values:

- **Field comparisons** - Password confirmation, date ranges
- **Computed constraints** - Budget limits, quantity × price calculations
- **Conditional requirements** - Fields that depend on other fields
- **Complex boolean logic** - Multiple conditions with AND/OR

Melbi expresses these rules clearly and ensures they're type-safe.
