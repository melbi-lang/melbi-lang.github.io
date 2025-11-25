---
title: Data Processing
layout: tutorial
parent: Examples
nav_order: 2
permalink: /tutorial/examples/data-processing/
code_sample: |
  { product = order.product, line_total = (order.quantity as Float) * order.price }
  where {
      order = { product = "Widget", quantity = 5, price = 10.0 },
  }
---

# Data Processing
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

Data processing involves transforming, filtering, and aggregating data. Melbi expressions are commonly used to define the logic that gets applied over collections by a host application.

When you write a Melbi expression, you typically work with a single record that the host provides. The host then applies your expression across a collection—filtering, transforming, or aggregating the results.

## Filter conditions

A filter condition is a boolean expression that decides whether to keep a record:

```melbi
user.status == "active"
where {
    user = { name = "Alice", status = "active", score = 85 },
}
```

Result: `true`

When the host applies this expression to a collection of users, only those where the expression returns `true` are kept. Given users Alice (active), Bob (inactive), and Carol (active), the result would be Alice and Carol.

### Multiple conditions

```melbi
product.in_stock and product.price < 50.0
where {
    product = { name = "Keyboard", price = 45.0, in_stock = true },
}
```

Result: `true`

This finds products that are both in stock AND under $50.

## Transformations

A transformation expression produces a new value from the input:

```melbi
{
    product = order.product,
    line_total = (order.quantity as Float) * order.price,
}
where {
    order = { product = "Widget", quantity = 5, price = 10.0 },
}
```

Result: `{ product = "Widget", line_total = 50.0 }`

Each order record is transformed into a summary with just the product name and calculated line total.

### Extracting fields

```melbi
employee.department
where {
    employee = { name = "Alice", department = "Engineering", salary = 85000 },
}
```

Result: `"Engineering"`

Applied across employees, this extracts just the department from each record.

## Computed values

Expressions can compute derived values from the input:

```melbi
{
    full_name = person.first_name ++ " " ++ person.last_name,
    is_adult = person.age >= 18,
}
where {
    person = { first_name = "Alice", last_name = "Smith", age = 25 },
}
```

Result: `{ full_name = "Alice Smith", is_adult = true }`

## Aggregation helpers

For numeric collections, you can use array functions directly:

```melbi
{
    total = Array.Fold(scores, 0, (acc, s) => acc + s),
    count = Array.Len(scores),
    average = (Array.Fold(scores, 0, (acc, s) => acc + s) as Float) / (Array.Len(scores) as Float),
}
where {
    scores = [85, 92, 78, 95, 88],
}
```

Result: `{ total = 438, count = 5, average = 87.6 }`

We use `Fold` to sum the values and `Len` to count them. The average requires converting to Float for decimal division.

## Checking conditions

Testing whether values meet certain criteria:

```melbi
student.grade >= 60
where {
    student = { name = "Carol", grade = 58 },
}
```

Result: `false`

Carol's grade of 58 means she's not passing. The host can use expressions like this to check conditions across a collection—finding if any student is failing, or if all students are passing.

## Sorting keys

An expression can extract the value to sort by:

```melbi
employee.salary
where {
    employee = { name = "Bob", department = "Sales", salary = 72000 },
}
```

Result: `72000`

When the host sorts a collection using this expression, employees are ordered by their salary value.

## Combining logic

Real data processing often combines multiple operations:

```melbi
{
    qualifies = order.amount >= 100.0 and order.region == "US",
    discount = if order.amount >= 500.0 then 0.15 else if order.amount >= 200.0 then 0.10 else 0.05,
    final_amount = order.amount * (1.0 - discount),
}
where {
    order = { amount = 250.0, region = "US" },
    discount = if order.amount >= 500.0 then 0.15 else if order.amount >= 200.0 then 0.10 else 0.05,
}
```

Result: `{ qualifies = true, discount = 0.10, final_amount = 225.0 }`

This checks eligibility, calculates a tiered discount, and computes the final amount—all in one expression.

## Why data processing in Melbi?

Melbi expressions for data processing are:

- **Focused** - Each expression handles one record; the host manages the collection
- **Type-safe** - The type system ensures you're working with the right data shapes
- **Readable** - Clear, declarative logic that's easy to understand
- **Testable** - You can verify expressions with sample data before deploying
