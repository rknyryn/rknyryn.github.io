---
title: Rules Never Change
excerpt: Fundamental principles and rules that remain constant in software architecture
date: 2026-02-28
series: Real Problems, Real Architecture
chapter: 1
tags: [architecture, design, patterns, fundamentals]
---

We experienced something like this on a real project:

**We're writing a simple reservation module.**

> "What's the big deal?" we said. Get a date, save it, done.

Then the rules started coming:

– Can't select past dates.
– Can't select dates more than 1 month ahead.
– Same user can't make a second reservation on the same day.
– API requests can't be null / empty.

**Before the code grew out of control, we realized:**
> The real problem isn't the reservation.
> The real problem is where the rules will live.

**Because if you put them in the wrong place, one day someone will bypass that rule.**

And surprises start in production.

## Clarifying the Distinction

**There Are Three Levels:**
- **Validation** → Is the data correct?
- **Application** → Is there a conflict in the system?
- **Domain** → Does this behavior align with the nature of the business?

> The essence of architecture is this:
> - Validation exists so data doesn't become garbage.
> - Application exists to manage flow.
> - Domain is the character of the system.

## Domain – The Nature of a Reservation

**If a reservation is temporally invalid, it shouldn't be created in the first place.**

```csharp
public class Reservation
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime Date { get; private set; }

    private Reservation() { }

    public Reservation(Guid userId, DateTime date, DateTime today)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        SetDate(date, today);
    }

    public void SetDate(DateTime date, DateTime today)
    {
        if (date.Date < today.Date)
            throw new BusinessRuleException("Cannot select past dates.");

        if (date.Date > today.Date.AddMonths(1))
            throw new BusinessRuleException("Cannot select dates more than 1 month ahead.");

        Date = date.Date;
    }
}
```

Here's the critical point:
> **The Reservation object protects its own integrity.**

No matter who calls it. API, background job, CLI tool… doesn't matter.

## Application – System Conflicts

**"Same user can't make a second reservation on the same day" requires database checks.**

```csharp
public class ReservationService
{
    private readonly IReservationRepository _repository;
    private readonly IDateTimeProvider _dateTimeProvider;

    public ReservationService(
        IReservationRepository repository,
        IDateTimeProvider dateTimeProvider)
    {
        _repository = repository;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task CreateAsync(Guid userId, DateTime date)
    {
        var today = _dateTimeProvider.UtcNow.Date;

        if (await _repository.ExistsForUserOnDateAsync(userId, date.Date))
            throw new BusinessRuleException("A reservation already exists for this day.");

        var reservation = new Reservation(userId, date, today);

        await _repository.AddAsync(reservation);
    }
}
```

The Application layer orchestrates.
It manages flow.
**But it doesn't replace the domain.**

## Validation – The Guard at the Gate

```csharp
public class CreateReservationValidator 
    : AbstractValidator<CreateReservationRequest>
{
    public CreateReservationValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Date).NotEmpty();
    }
}
```

It's just a filter.
**Not business logic yet.**

## Controller?

**The controller knows nothing.**
- Doesn't know about the database.
- Doesn't know about rules.
- Just calls the service.

> **Dumb controller, smart domain.**

## The Real Question

What if someone new's up a Reservation entity and sets Date to public tomorrow?

**The design is compromised.**

But if you enforce it through behavior, the system defends itself.

### The Measure of Good Architecture

> **Rules should be impossible to bypass.**

In this series, I'll share the real problems I've encountered and the architectural solutions we applied.

**It'll start simple.** Then we'll get into concurrency, distributed scenarios, idempotency, domain events, and more complex topics.

> **Because real architecture isn't in PowerPoint; it's in edge cases.**

---

**The strongest code in software is code that makes it hard to make mistakes.**