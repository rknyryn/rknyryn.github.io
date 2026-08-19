---
title: "Attributes: Just Labels on Code, or Framework's Secret Commands?"
excerpt: The framework isn't executing it. It's interpreting the commands you wrote.
date: 2026-08-19
series: Real Problems, Real Architecture
chapter: 2
tags: [architecture, design, patterns, dotnet, fundamentals]
---

## The Day I Looked at an Endpoint and Saw Almost No Code

A colleague and I were doing a code review for a new endpoint.

I opened the controller.

```csharp
[Authorize]
[ValidateModel]
[AuditLog]
[HttpPost]
public async Task<IActionResult> Create(CreateOrderCommand request)
{
    return Ok(await _mediator.Send(request));
}
```

The method was almost empty.

Yet the system worked.

Authorization was being enforced. Validation was running. Audit logs were being created. The endpoint appeared in Swagger documentation.

But none of that code was here.

I wondered:

> Where is all this happening?

The answer was largely hidden in Attributes.

In the .NET world, Attributes aren't just decorative labels placed above code. Most of the time, they're instructions to the framework. The framework reads these instructions, interprets them, and applies the appropriate behavior.

In this piece, we'll examine what Attributes really are, how they work, and why they're one of the invisible heroes of modern .NET applications.

## What Is an Attribute?

Let's say we write a class.

```csharp
public class UserService
{
}
```

This class can contain methods and properties.

But what if we want to provide extra information about the class itself?

For instance:

- Is this class deprecated?
- Does it require authorization?
- Is it an API endpoint?
- Which route does it map to?
- How should it appear in Swagger?

This information isn't part of the class's business logic. But it affects how the system behaves.

That's exactly where Attributes come in.

```csharp
[Obsolete]
public class UserService
{
}
```

At this point, the C# compiler writes additional metadata to the class.

So what's actually happening is:

> "Store extra information about this class."

That's it.

An Attribute does nothing by itself. This critical point is often overlooked.

## Attributes Don't Do Anything By Themselves

Many developers, early in their careers, think like this:

```csharp
[Authorize]
```

I wrote this, so authorization is running.

That means the Authorize Attribute performs authorization.

Actually, no.

The Authorize Attribute just carries information. ASP.NET Core does the real work.

When a request arrives, the framework:

- Finds the endpoint
- Reads the Attributes on the endpoint
- Determines whether authorization is required
- Runs the necessary checks

So the process is actually:

```text
Request
   ↓
ASP.NET Core Pipeline
   ↓
Read Attributes
   ↓
Execute Required Mechanism
   ↓
Response
```

Attributes don't issue commands. The framework interprets the commands.

Small difference, but it's architecturally significant.

## Why Do We Keep Using Attributes?

Because the alternative becomes terrible over time.

Imagine we're checking authorization inside every action.

```csharp
public IActionResult Create()
{
    if(!User.IsInRole("Admin"))
    {
        return Forbid();
    }

    // actual business logic
}
```

Then another endpoint. Then another. Then a hundred more.

Eventually, the same code appears everywhere in the application.

That's exactly when the Attribute approach saves us.

```csharp
[Authorize(Roles = "Admin")]
public IActionResult Create()
{
    // actual business logic
}
```

This way:

- Repetitive code disappears.
- Centralized management is possible.
- Rules become visible.
- Maintenance costs drop.

That's the real purpose of Attributes:

> Extract behavior from inside the code and make it declarative.

## Declarative Programming

Let's think about two different approaches.

### Imperative

```csharp
if(User.IsInRole("Admin"))
{
    // do work
}
```

You're telling the system:

> I'll explain how to do it.

### Declarative

```csharp
[Authorize(Roles = "Admin")]
```

Here you're saying:

> I'm telling you what I want. You figure out how.

Most modern frameworks are built on this approach.

ASP.NET Core, Entity Framework, xUnit, Swagger, MediatR... they all use Attributes extensively.

Because the intent of the code becomes clearer.

When you look at an endpoint, you can see a significant portion of the business rules without diving into the method body.

## Reflection and Metadata

Now let's look behind the curtain.

How does the framework see these Attributes?

Answer: **Reflection**

For example:

```csharp
[MyCustom]
public class UserService
{
}
```

At runtime, the framework can do this:

```csharp
var attributes = typeof(UserService).GetCustomAttributes();
```

Result:

```text
MyCustomAttribute
```

Now the framework can read this information.

That's exactly why Attributes are stored as metadata. They're not embedded in the code. They're kept as a separate information layer.

What the framework does is precisely this:

> Read the metadata, interpret it, and apply the appropriate behavior.

Without Reflection, many of the Attribute mechanisms we use today wouldn't exist.

## Can We Write Our Own Attributes?

This question usually comes up:

> How do we write our own Attributes?

Actually, it's quite simple.

```csharp
[AttributeUsage(AttributeTargets.Method)]
public sealed class AuditLogAttribute : Attribute
{
}
```

Usage:

```csharp
[AuditLog]
public IActionResult Create()
{
    return Ok();
}
```

It looks magical at first. But what's really happening is quite ordinary.

At runtime, the framework inspects the endpoint. When it sees `AuditLogAttribute` on the endpoint, it triggers the related mechanism.

Here's the key point:

Writing an Attribute is easy. The hard part is building the architecture to interpret it.

In enterprise projects, usually 10% of the work is the Attribute itself. The remaining 90% is the pipeline that executes it.

## When Do Attributes Actually Execute?

Most Attributes don't actually execute themselves.

This sounds strange when you first hear it.

Because most developers think like this:

```csharp
[Authorize]
```

I wrote this, so this code is executing.

No.

What's executing is ASP.NET Core.

The pipeline finds the endpoint. Then it reads the metadata on the endpoint.

```text
Request
    ↓
Find Endpoint
    ↓
Read Attributes
    ↓
Execute Required Mechanisms
    ↓
Reach Action
```

So it's more accurate to think of an Attribute not as a small script, but as a metadata object.

The two statements in the title actually come together here.

Attributes are labels placed on code. But the framework interprets these labels as hidden commands.

The magic isn't in the Attribute. It's in the framework that reads and interprets it.

## Do Attributes Affect Performance?

Every .NET developer hears at some point in their career that Reflection is slow.

Then they write their first custom Attribute and wonder:

> If I use this on hundreds of endpoints, will it slow down the system?

Fortunately, the answer is usually no.

Many developers think the cost occurs here:

```csharp
[AuditLog]
```

But in the real world, the cost usually comes from here:

```text
Request
 ↓
Attribute Detected
 ↓
Logging Mechanism Executed
 ↓
Database Insert
 ↓
External Service Call
 ↓
Response
```

Reading an Attribute takes microseconds.

But:

- Database operations
- Elasticsearch writes
- External service calls
- Network latency
- File system access

can create costs in the milliseconds or even seconds range.

So in most scenarios, Attributes aren't the problem. The behavior triggered by Attributes is.

### When Is Reflection Actually a Problem?

Not in most enterprise applications.

But if you're using an approach like this:

```csharp
foreach(var type in allTypes)
{
    foreach(var method in type.GetMethods())
    {
        var attrs = method.GetCustomAttributes();
    }
}
```

And doing this repeatedly on every request, you could create unnecessary overhead.

That's why modern frameworks cache metadata. They do the discovery work when the application starts. Then they work with pre-computed data as much as possible.

So today:

> Rather than fearing Attribute usage, it's wiser to avoid unnecessary Reflection calls.

## Attributes and Middleware

This question comes up in almost every team at least once.

Because both affect the request flow.

But their purposes are different.

### Middleware

Middleware runs for all requests.

```text
Request
 ↓
Middleware
 ↓
Middleware
 ↓
Middleware
 ↓
Endpoint
```

For example:

- Global Exception Handling
- Request Logging
- Authentication
- CORS
- Response Compression

These concerns are usually handled at the middleware level.

Because they affect the entire application.

### Attributes

Attributes are more selective.

```csharp
[Authorize]
[AuditLog]
public IActionResult Create()
{
}
```

They apply only to the specific endpoint.

In other words:

- Middleware: Applies to everyone in the system.
- Attributes: Applies only where I want it.

### When Should We Use Each?

There's a simple rule.

If the behavior concerns the entire application:

```text
Middleware
```

If the behavior concerns specific endpoints:

```text
Attributes
```

For example:

**Best for Middleware:**

- Global Exception Handling
- Request Logging
- Correlation Id
- Authentication
- Response Compression

**Best for Attributes:**

- Authorize
- Audit Log
- Feature Flag
- Rate Limit
- Custom Validation
- Endpoint-based Cache

Making this distinction correctly is important.

Because when you reach hundreds of endpoints, the sustainability of your architecture depends largely on these decisions.

## Conclusion

Many developers see Attributes only as small constructs written within square brackets.

But in modern .NET applications, the reality is quite different.

Attributes are often:

- The language of communication between the framework and the developer.
- Metadata carriers.
- Entry points for cross-cutting concerns.
- Foundation stones of declarative programming.
- Architectural tools that make code behavior visible.

And perhaps most importantly:

> Attributes don't actually execute. The framework executes instead. But the framework learns how to behave largely from them.

The next time you see code like this:

```csharp
[Authorize]
[AuditLog]
[FeatureFlag("WorkTracking")]
[Transaction]
public async Task<IActionResult> Create(...)
```

Take a moment before diving into the action body.

Because the system's story has likely already started being told in those lines above.
