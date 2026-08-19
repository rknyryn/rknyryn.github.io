---
title: "HTTP Cache, REST and RPC: Architectural Decision Guide"
excerpt: How do you balance data consistency and performance when choosing a cache strategy?
date: 2026-08-19
series: Real Problems, Real Architecture
chapter: 3
tags: [architecture, http, cache, rest, rpc, performance]
---

## When Should You Use Cache?

HTTP cache (used by browsers and CDNs) is a powerful mechanism for performance.

But it's not always the right choice.

Using cache isn't an architectural preference. It's a decision based on data consistency and business needs.

### The Basic Decision Rule

Ask yourself one question first:

> "Would it be a problem if this data was stale for a while?"

- **No** → Use cache
- **Yes** → Don't use cache

It's that simple. Yet most teams never ask this question.

Later, they face stale data problems in production.

### Scenarios Where Cache Is Appropriate

- Product listings and details (same data requested repeatedly)
- Blog and content (rarely changes)
- Public API GET endpoints (CDN reduces load significantly)
- Static files (JS, CSS)

### Scenarios Where Cache Is Not Appropriate

- Admin panels (add/delete/update) — stale data causes critical errors
- User-specific data — wrong user might get someone else's data
- Instant data (stock, balance, account) — freshness is mandatory
- Dashboards and realtime data — latency is unacceptable

It sounds simple, yet 70% of teams make this decision intuitively.

Then they face stale data issues in production.

## What Happens Behind the Scenes of an HTTP Request?

Picture this flow:

```
User (Browser) → CDN → Origin Server (API)
```

### The First Request

The browser makes this request:

```http
GET /api/products/123 HTTP/1.1
Host: api.example.com
```

Step by step:

1. The browser checks its own cache. On first request, there's no entry.
2. The request goes to the CDN. The CDN can't find it either and forwards it to the origin server.
3. The origin server returns a response.

```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=60
ETag: "d4f8a3b2"
Content-Type: application/json

{
  "id": 123,
  "name": "Laptop",
  "price": 1299
}
```

4. The browser and CDN cache this response (if the headers permit).

**Critical point:** Cache behavior depends entirely on the HTTP headers sent by the server. It's not automatic.

## What Do Cache Headers Mean?

### Cache-Control

```http
Cache-Control: public, max-age=60
```

Here's what the directives mean:

- `public` → Anyone can cache (browser, CDN, proxies)
- `private` → Only the browser caches
- `max-age=60` → Valid for 60 seconds
- `no-cache` → Cache it, but verify with the server every time
- `no-store` → Never cache

For example, if you use `no-store`:

```http
Cache-Control: no-store
```

Nothing gets cached. Every request goes to the server.

### ETag

An ETag is a "fingerprint" the server assigns to that specific piece of data.

```http
ETag: "d4f8a3b2"
```

When content changes, the ETag changes too.

## Second Request: Cache In Action

Before 60 seconds pass, if the same URL is requested again:

```
User → Browser: "I have this data, here you go"
```

No request reaches the server. The browser responds from cache.

It's faster.

The server stays idle.

Network traffic reduces.

## After Cache Expires: Validation

After 60 seconds, when the same URL is requested again:

```http
GET /api/products/123 HTTP/1.1
If-None-Match: "d4f8a3b2"
```

The server checks the status.

**If data hasn't changed:**

```http
HTTP/1.1 304 Not Modified
```

The browser keeps using its cached data.

**If data has changed:**

```http
HTTP/1.1 200 OK
ETag: "new-etag"
Cache-Control: public, max-age=60
```

New data is returned and cached again.

## The Stale Data Problem

If data changes before the cache expires:

```
Server:  new data
Browser: old data
```

This is critical.

Especially with prices, balances, stock.

### Solution Strategies

**1. Short max-age**

```http
Cache-Control: public, max-age=5
```

Updates every 5 seconds. But more load on the CDN.

**2. no-cache Directive**

```http
Cache-Control: no-cache
```

Caches it but verifies with the server each time (304 controlled).

**3. no-store**

```http
Cache-Control: no-store
```

Never caches. Safest but slowest.

**4. Cache Busting**

```
/products/123?v=2
```

Add parameters to the URL to force a new request.

## What Is REST and Its Relationship with Cache?

REST is a resource-oriented architecture.

```http
GET    /api/products
GET    /api/products/123
POST   /api/products
PUT    /api/products/123
DELETE /api/products/123
```

Each resource has a fixed URL.

### REST with Cache

GET requests are cache-friendly.

Because GET requests don't modify data.

The same URL returns the same data repeatedly.

This consistent URL structure allows cache to work effectively.

But using REST doesn't automatically give you cache.

Cache behavior depends entirely on:

- `Cache-Control` header
- `ETag`
- CDN configuration

REST just provides a more suitable and stable URL structure for caching.

## What Is RPC and Its Relationship with Cache

RPC (Remote Procedure Call) is an action-oriented architecture.

```http
GET  /api/products/GetById?id=123
GET  /api/products/GetAll
POST /api/products/CreateProduct
POST /api/products/DeleteProduct
POST /api/products/UpdatePrice?id=123&price=999
```

It embeds method names in the URL.

### RPC with Cache: Common Misconception

Many developers think:

> RPC can't be cached.

That's wrong.

RPC can be cached too. Cache depends on HTTP rules, not architecture.

### The Real Difference

**a) Query String Problem**

```
/api/products/GetById?id=123
/api/products/GetById?id=456
```

Each parameter combination is a separate cache entry. Cache hit ratio drops on the CDN.

**b) POST Usage**

```http
POST /api/products/GetById
```

POST isn't cached by default.

**c) URL Consistency**

```http
GET /api/products/GetById/123
```

Less consistent than REST. More cache key variations.

## REST vs RPC: Detailed Analysis

### From Browser Perspective

**GET request:** Cacheable in both architectures.

**POST request:** Not cached in both architectures.

No difference.

### From CDN Perspective

Both can be cached.

But **cache hit ratio** differs.

```
/products/123        → single cache key (REST)
/products?id=123     → varied cache keys (RPC)
```

REST delivers better cache hit.

Why? URLs are consistent and predictable.

In RPC, query strings and parameter variations fragment the cache.

## How to Optimize CDN Cache Keys

Your goals:

- Increase cache hit ratio
- Reduce the number of cache keys

### Strategy 1: Remove Unnecessary Query Parameters

```
/products/123        ✔️  (high cache hit)
/products?id=123     ⚠️  (low cache hit)
```

### Strategy 2: Include Only Necessary Parameters

In CDN configuration, include only essential parameters in the cache key.

For example, if `id` and `lang` are needed but `utm_source` isn't:

```
cache key = /products + id + lang
```

### Strategy 3: Minimize Header Variation

Headers like `Authorization` or `Accept-Language` fragment the cache.

If possible, move the parameter to the URL.

### Strategy 4: Use Path-based Design

```
/products/123/en        ✔️  (path-based)
/products/123?lang=en   ⚠️  (query string)
```

Path-based design delivers better cache hit.

### Strategy 5: Set TTL Correctly

Choose appropriate TTL for each data type:

- **Static file (JS, CSS):** 1 year
- **Product detail:** 60 seconds
- **Product listing:** 30 seconds
- **Blog post:** 1 hour
- **User data:** Don't cache

## How to Set Up Cache in ASP.NET Core

### Simple Usage

```csharp
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public IActionResult GetProduct(int id)
{
    return Ok(/* data */);
}
```

### Manual Header Control

```csharp
public IActionResult GetProduct(int id)
{
    Response.Headers["Cache-Control"] = "public,max-age=60";
    return Ok(/* data */);
}
```

### Using ETag

```csharp
public IActionResult GetProduct(int id)
{
    var product = /* fetch product */;
    var etag = GenerateETag(product);
    
    if (Request.Headers["If-None-Match"] == etag)
        return StatusCode(304);

    Response.Headers["ETag"] = etag;
    return Ok(product);
}
```

### Disabling Cache

```csharp
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public IActionResult GetSensitiveData()
{
    return Ok(/* data */);
}
```

## Pragmatic Usage

Real-world scenarios look like this:

```http
POST /api/orders/123/approve
POST /api/orders/123/cancel
POST /api/payments/456/refund
GET  /api/reports/monthly-summary
```

If you need to bend pure REST, bend it.

But don't forget your cache strategy.

You can build around a few POST endpoints and cache the GETs.

## Decision Guide

Which architecture should you choose, and when?

**CRUD operations → REST**
HTTP verbs align.

**Public API → REST**
Standard and cache-friendly.

**High-traffic reads → REST**
CDN advantage.

**Action operations → Hybrid**
More natural.

**Real-time data → Either**
Cache disabled.

## Conclusion

Three key points to remember about cache, REST, and RPC:

1. **Cache behavior depends on HTTP headers.** Not architecture. Choosing REST or RPC doesn't guarantee caching.

2. **Cache behavior is a business decision.** Not a technology decision. Ask: "Can this data be stale?"

3. **Architectural choice affects cache efficiency.** REST delivers better cache hit. But you can mix both approaches to reach your goal.

When writing an endpoint, ask yourself:

- How stale can this data get?
- How many times will it be called?
- Can I leverage the CDN?
- Is there a stale data risk?

After answering these questions, decide your cache strategy.

Then choose your architecture.

Not the other way around.
