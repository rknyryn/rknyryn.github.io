---
title: How Many Keys Does 8 GB Redis Really Hold?
excerpt: Understand Redis memory management and make realistic capacity estimates
date: 2026-03-03
series: Works but at What Cost?
chapter: 1
tags: [redis, performance, optimization, caching, infrastructure]
---


Redis seems free and fast. However, memory costs can add up quickly. The question "I have 8 GB of Redis, how many keys can I store?" is far more complex than simple division.

## Redis Memory Structure

Each key-value pair in Redis consumes more than just the data itself:

```
Total Memory = Key Memory + Value Memory + Metadata + Internal Overhead
```

### 1. Key Memory

```
Key String "user:1234:profile" 
= 33 bytes String object + Base Overhead
≈ 49 bytes (including Redis internal structures)
```

Rule: String key = `String Length + 16 bytes overhead`

### 2. Value Memory

Depends on the data type:

#### String Value
```
"John Smith" 
= 10 bytes + 49 bytes overhead
= ~59 bytes total
```

#### Hash (Object)
```
user:1234:profile {
    name: "John Smith",
    email: "john@example.com",
    age: 28
}
```

Estimate:
- Key: 33 bytes
- 3 field keys + 3 field values: ~200 bytes
- Overhead: ~60 bytes
- **Total: ~350 bytes**

#### List
```
"notifications:user:1234" -> [
    "New order #1",
    "Payment confirmed",
    "Shipped today"
]
```

Each list element: ~100 bytes
10-element list: ~1,300 bytes (including overhead)

#### Set
```
"user:1234:friends" -> {
    "456", "789", "1011", ...
}
```

10,000-member set: ~400 KB approximately

## Practical Example: E-Commerce System

### Scenario

- **Active Users**: 100,000
- **Per-user cache**: 2 KB (profile + preferences)
- **Session storage**: 500 bytes × 50,000 active sessions
- **Product cache**: 10,000 products × 500 bytes
- **Rate limiting counters**: ~200 KB

### Calculation

```
User profiles:       100,000 × 2,000 bytes = 200 MB
Active sessions:     50,000  × 500 bytes = 25 MB
Product cache:       10,000  × 500 bytes = 5 MB
Rate limiters:       ~200 KB
Overhead (10%):      ~23 MB

Total ≈ 253 MB
```

**Result**: With 8 GB Redis, we can comfortably run 30+ copies of such a system. So what's the problem?

## The Real Issue: Estimation Mistakes

### 1. Memory Leaks

Forgetting to set expiration:

```python
# ❌ Bad - Never expires
redis.set("temp:data:1", large_json_string)

# ✅ Good - Deleted after 1 hour
redis.setex("temp:data:1", 3600, large_json_string)
```

**Result**: 
- First month: nothing gets deleted from memory
- Second month: surprise! Redis out-of-memory error

### 2. Spikes (Sudden Increases)

During flash sale:

```
Normal: 50 MB/hour data addition
Flash sale: 5 GB/hour data addition (100x increase!)
```

**Expected**: 8 MB/hour growth × 24 hours = 192 MB/day  
**Reality**: Sudden 3-4 GB spike during flash sale

### 3. Replication & Persistence Overhead

```
Primary instance: 3 GB
Replica instance: 3 GB (copy)
AOF Persistence: +1 GB (buffer written to disk)

Net: 7 GB, but "capacity" is only 8 GB!
```

## Realistic Capacity Model

```
8 GB Redis Instance
= 8,000 MB

Allocation:
  - Primary data: 5,000 MB (62%)
  - Replica overhead: 2,000 MB (25%)
  - Safety margin (eviction): 1,000 MB (13%)
```

**Practical Capacity**: ~5 GB = 5,000,000 × 1 KB key-value pairs

## Optimization Techniques

### 1. Compression

```python
import json
import zlib

data = {"user_id": 123, "name": "John", ...}
compressed = zlib.compress(json.dumps(data))

redis.set("user:123", compressed)
# 1 KB → ~200 bytes (80% savings!)
```

### 2. Data Type Selection

```
Bad:     "user:123:name" = "John" (30 bytes key + 4 bytes value)
Good:    "users" (hash) = {123: "John"} (shared key overhead)

100,000 users: 3 MB savings!
```

### 3. Aggressive TTL

```python
# Refresh session every 5 minutes
redis.setex("session:abc", 600, user_session)

# Evicts after 7 days
# vs.
# Never set, accumulates indefinitely
```

## Monitoring

```bash
redis-cli info memory

# Output:
# used_memory: 3.2GB
# used_memory_peak: 3.8GB
# memory_fragmentation_ratio: 1.15
```

- **fragmentation_ratio > 1.3**: Problem! Memory optimization needed
- **used_memory_peak**: Highest point (watch for sudden spikes)

## Best Practices

1. ✅ **Add TTL to every key** (especially sessions/cache)
2. ✅ **Monitor memory usage monthly**
3. ✅ **If you have replicas, think 2x capacity**
4. ✅ **Watch persistence output buffer**
5. ✅ **Leave 30% safety margin for spikes**

## Conclusion

The question "How many keys in 8 GB?" is more than technical math. Real growth curves, design mistakes, and operational overhead must be considered.

Good news: if you know and plan ahead, Redis is incredibly cost-effective.
