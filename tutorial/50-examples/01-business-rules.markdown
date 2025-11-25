---
title: Business Rules
layout: tutorial
parent: Examples
nav_order: 1
permalink: /tutorial/examples/business-rules/
code_sample: |
  order.subtotal >= 50.0 and order.destination == "US"
  where {
      order = { subtotal = 75.0, destination = "US" },
  }
---

# Business Rules
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

Business rules are conditions that determine how your application behaves—who can access what, what discounts apply, whether an order qualifies for free shipping. These are exactly the kind of logic that Melbi excels at expressing clearly.

## Access control

Determining whether a user can access a resource based on their role and department:

```melbi
user.role == "admin" or (user.role == "editor" and user.department == resource.owner_dept)
where {
    user = { role = "editor", department = "marketing" },
    resource = { type = "document", owner_dept = "marketing" },
}
```

Result: `true`

The rule says: admins can access anything, but editors can only access resources owned by their department.

## Pricing tiers

Calculating a discount percentage based on customer history:

```melbi
if customer.lifetime_purchases > 10000 then 0.20
else if customer.lifetime_purchases > 5000 then 0.15
else if customer.is_member then 0.10
else 0.0
where {
    customer = { lifetime_purchases = 5000, is_member = true },
}
```

Result: `0.10`

This customer has exactly $5000 in lifetime purchases (not over), so they don't qualify for the 15% tier. But they are a member, so they get 10% off.

## Shipping eligibility

Determining if an order qualifies for free shipping:

```melbi
order.subtotal >= 50.0 and order.destination == "US"
where {
    order = { subtotal = 75.0, items = 3, destination = "US" },
}
```

Result: `true`

Free shipping requires both conditions: order of $50 or more AND shipping to the US.

## Feature flags

Determining which features a user can access based on their plan:

```melbi
{
    export_pdf = user.plan == "pro" or user.plan == "enterprise",
    advanced_analytics = user.plan == "enterprise",
    beta_features = user.beta_tester,
}
where {
    user = { plan = "pro", beta_tester = true },
}
```

Result: `{ export_pdf = true, advanced_analytics = false, beta_features = true }`

This returns a record of boolean flags that can be used to show or hide features in the UI.

## Order approval

Determining if an order needs manual approval:

```melbi
needs_approval where {
    order = { amount = 1500.0, is_new_customer = true, payment_method = "invoice" },
    high_value = order.amount > 1000.0,
    risky_payment = order.payment_method == "invoice",
    needs_approval = high_value or (order.is_new_customer and risky_payment),
}
```

Result: `true`

High-value orders always need approval. New customers paying by invoice also need approval.

## Grade assignment

Converting a numeric score to a letter grade:

```melbi
if score >= 90 then "A"
else if score >= 80 then "B"
else if score >= 70 then "C"
else if score >= 60 then "D"
else "F"
where {
    score = 85,
}
```

Result: `"B"`

## Why business rules in Melbi?

These examples show patterns that can't be expressed with simple regex or pattern matching:

- **Multi-condition logic** - Combining AND, OR, and nested conditions
- **Numeric comparisons** - Greater than, less than, ranges
- **Cross-field dependencies** - One field's value affects how another is evaluated
- **Computed results** - Not just true/false, but calculated values like discount percentages

Melbi makes these rules readable and maintainable, even for non-programmers who need to understand or modify the business logic.
