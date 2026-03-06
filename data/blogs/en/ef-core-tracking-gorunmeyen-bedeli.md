---
title: The Hidden Cost of EF Core Tracking
excerpt: AsNoTracking looks like just one line. But it cuts memory allocation nearly in half.
date: 2026-03-06
series: Works but at What Cost?
chapter: 2
tags: [efcore, dotnet, performance, orm, optimization]
---

Let's think about an endpoint. It fetches records from a knowledge base. A perfectly ordinary query.

Everything works. No errors. But I got curious and ran a small experiment.

## 🧪 Benchmark Setup

I benchmarked four versions of the same query:

- `GetAllKnowledgeBank`
- `GetAllKnowledgeBankAsync`
- `GetAllKnowledgeBankNoTracking`
- `GetAllKnowledgeBankNoTrackingAsync`

There is only one difference in the code:

```csharp
.AsNoTracking()
```

![Benchmark Results](/images/blog/ef-core-tracking-gorunmeyen-bedeli/benchmark_result.JPEG)

## 📊 Results

**Queries with tracking enabled:**

- Average duration: ~320 ms
- Memory allocation: ~2100 KB

**Queries using NoTracking:**

- Average duration: ~340–360 ms
- Memory allocation: ~950 KB

Something small but significant is happening here.

NoTracking can appear a few milliseconds slower in some cases. But memory allocation drops to nearly half.

> **Roughly: 55% less memory consumption.**

## 🔍 Why Does This Matter?

Let's think about this in a real system. This endpoint could be:

- Called hundreds of times per second
- Returning large lists
- Running in a long-lived API

Imagine generating an extra ~1 MB of allocation per request. After a while:

- The Garbage Collector runs more frequently
- CPU usage rises
- Latency starts to fluctuate

And one day someone on the team asks: **"Why is the API sometimes slow?"**

Most of the time the answer isn't complex algorithms. Most of the time the answer is small ORM behaviors.

## 💡 When Should You Use AsNoTracking?

EF Core's tracking mechanism is powerful — it tracks entity changes. But not every query actually needs that tracking.

If data is only going to be **read** and not written back, tracking is unnecessary. That's why one small line can sometimes make a big difference:

```csharp
var list = await _context.KnowledgeBank
    .AsNoTracking()
    .ToListAsync();
```

---

There's an interesting truth in software.

Most systems struggle not because they work incorrectly, but because they work **more expensively than necessary**.

That's exactly the question of our series: *Works… but at what cost?*