---
title: How Many Keys Does 8 GB Redis Really Hold?
excerpt: Understand Redis memory management and make realistic capacity estimates
date: 2026-03-03
series: Works but at What Cost?
chapter: 1
tags: [redis, performance, optimization, caching, infrastructure]
---

In this section, we examine Redis memory usage and performance characteristics using real test data.

> **Tests were performed in a local development environment.** Not a guarantee for production, but it gives serious insight for capacity planning.

⚠️ **Note:** These values are for reference only. Every system has different data structures and usage patterns. Make sure to measure and monitor in your own environment.

## 🎯 Test Summary

**We ran a bulk insert scenario with real data and here are the results:**

| Metric | Value | Description |
|--------|-------|-------------|
| Test Data | 3,603 keys | Each key contains 222 data objects |
| Total Memory | ~719 MB | Clean Redis: 1.23 MB → After test: 718.92 MB |
| Memory per Key | ~204 KB | JSON serialized list |
| Memory per Object | ~941 bytes | Average |
| Fragmentation | 0% | Jemalloc allocator working |
| Overhead | %0.14 | Almost all memory is actual data |

**Summary: A list of 222 objects takes up approximately 204 KB.**

## 💾 Memory Calculation

Example scenario:

```csharp
// Caching a list
var itemList = new List<ItemDto>(222);
var cacheKey = "APP:List_638993185531593551";

// Memory Usage:
// ├── JSON: ~204 KB
// ├── Redis key metadata: ~290 bytes
// └── Total: ~204.3 KB
```

Simple math:

Single object ≈ 941 bytes
222 objects ≈ 204 KB
1,000 keys ≈ 204 MB

Now things get serious.

## 🧮 How Many Keys Does 8 GB Redis Hold?

Theoretical calculation:

8,192 MB / 204 KB ≈ 40,000 keys

But you don't want 100% utilization in production.

**Safe approach:**
- Physical RAM: 8 GB
- Redis MaxMemory: 6 GB (75%)
- OS and other services: 2 GB

**In this case, safe capacity is around 30,000 keys.**

> Capacity planning is done by measurement, not estimation.

## ⏰ TTL is Critical

Redis doesn't do automatic cleanup. If you don't set a TTL, data stays.

```csharp
_cacheService.Set("List_123", data, expirationInMinutes: 120);
```

T=0 → Key created (~204 KB)
T=2 hours → Key deleted, memory reclaimed

**TTL is not just a feature, it's a memory management strategy.**

⚠️ **Warning:** Some clients take TTL in seconds, others in minutes. Always verify your implementation.

## 🚨 Eviction Policy is Critical

In the test environment, we had noeviction.

That's risky in production.

Recommended:

```
allkeys-lru
```

Least recently used keys are automatically deleted.

This is safer if you can tolerate cache data loss.

## 💽 Persistence Strategy

What happens when Redis restarts?

Options:

RDB only → Fast, low disk usage, small data loss risk

RDB + AOF → Safer but disk and performance cost

Neither → All data lost on restart

**For caching scenarios, RDB alone is usually sufficient.** TTL already aligns with temporary data logic.

## 📈 Without Monitoring, You're Flying Blind

In production, monitor at least these metrics:

- used_memory
- evicted_keys
- hit/miss ratio
- fragmentation ratio

If fragmentation goes above 1.5, consider alerting.
If evictions increase, review your capacity or TTL strategy.

**Seeing the limit on a graph is different from seeing it in logs.**

## 🎯 Does Optimization Really Work?

### 1️⃣ Compression

**Compressing JSON can save 30–50%.**

204 KB → 120–140 KB

What does that mean?

Instead of 40,000 keys on 8 GB,
60,000+ keys might be possible.

But CPU cost increases.

**Is memory expensive or is CPU?**
That decision depends on your system's usage profile.

### 2️⃣ Using Hashes

Instead of many small keys, using Hashes can reduce overhead.

Instead of individual keys:

```
HSET APP:OBJ:Group1 field1 "{json1}"
HSET APP:OBJ:Group1 field2 "{json2}"
```

You can achieve roughly 10–15% savings.

### 3️⃣ Selective Caching

You don't have to cache everything.

Cache big, expensive, frequently accessed queries.
Sometimes getting fast and cheap queries directly from DB makes more sense.

**Cache strategy = conscious choice.**

## 📊 Benchmark Summary

Memory efficiency: 99.96%

Fragmentation: 0%

Overhead: 0.14%

Key insertion rate: ~0.5 keys/second (in test conditions)

Overall system health: 9/10

⚠️ **The only gap:** Eviction policy must be updated in production.

## 🎓 Takeaways

- **222 objects ≈ 204 KB**
- **8 GB Redis ≈ theoretically 40,000 keys**
- **TTL is mandatory**
- **Eviction policy must be properly configured in production**
- **You can't manage capacity without monitoring**
- **Compression makes a real difference with large objects**

**Redis is fast.** But it's not unlimited.

**"It works" is not enough.**

The real question is: **What's the cost?**