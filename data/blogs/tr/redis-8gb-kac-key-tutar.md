---
title: 8 GB Redis Gerçekte Kaç Key Taşır?
excerpt: Redis bellek yönetimini anlayıp, gerçekçi kapasite tahminleri yapın
date: 2026-03-03
series: Çalışıyor Ama Kaça Mal Oluyor?
chapter: 1
tags: [redis, performance, optimization, caching, infrastructure]
---

# 8 GB Redis Gerçekte Kaç Key Taşır?

Redis ücretsiz ve hızlı görünür. Ancak, bellek fiyatlandırması hızla artabilir. "8 GB Redis'im var, kaç key koyabilirim?" sorusunun cevabı, basit bir bölme işleminden çok daha karmaşıktır.

## Redis Bellek Yapısı

Redis'te her key-value çifti, yalnızca verinin kendisinden daha fazlasını tüketir:

```
Toplam Bellek = Key Bellek + Value Bellek + Metadata + Internal Overhead
```

### 1. Key Bellek

```
Key String "user:1234:profile" 
= 33 bytes String object + Base Overhead
≈ 49 bytes (Redis internal structure dahil)
```

Kural: String key = `String Length + 16 bytes overhead`

### 2. Value Bellek

Farklı veri türlerine göre değişir:

#### String Value
```
"Ahmet Yılmaz" 
= 12 bytes + 49 bytes overhead
= ~61 bytes total
```

#### Hash (Nesne)
```
user:1234:profile {
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    age: 28
}
```

Tahmini:
- Key: 33 bytes
- 3 field key + 3 field value: ~200 bytes
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

Her list element: ~100 bytes
10 element list: ~1,300 bytes (overhead dahil)

#### Set
```
"user:1234:friends" -> {
    "456", "789", "1011", ...
}
```

10.000 member set: ~400 KB civarı

## Pratik Örnek: E-Ticaret Sistemi

### Senaryo

- **Aktif Users**: 100.000
- **Per-user cache**: 2 KB (profil + tercihler)
- **Session storage**: 500 bytes × 50.000 aktif session
- **Product cache**: 10.000 ürün × 500 bytes
- **Rate limiting counters**: ~200 KB

### Hesap

```
User profiles:       100.000 × 2.000 bytes = 200 MB
Active sessions:     50.000  × 500 bytes = 25 MB
Product cache:       10.000  × 500 bytes = 5 MB
Rate limiters:       ~200 KB
Overhead (10%):      ~23 MB

Total ≈ 253 MB
```

**Sonuç**: 8 GB Redis'te rahatlıkla ~250 bu tür sistemin 30+ kopyasını çalıştırabiliriz. Öyleyse, mesele nedir?

## Mesele: Buyut Tahminindeki Yanılgılar

### 1. Bellek Sızıntısı (Memory Leaks)

Expiration ayarını unutursanız:

```python
# ❌ Kötü - Hiç expire olmaz
redis.set("temp:data:1", large_json_string)

# ✅ İyi - 1 saat sonra silinir
redis.setex("temp:data:1", 3600, large_json_string)
```

**Sonuç**: 
- İlk ayda bellekte hiçbir şey silinmez
- 2. ayda sürpriz olarak Redis out-of-memory hatası alırsınız

### 2. Spike'lar (Ani Artışlar)

Flash sale sırasında:

```
Normal: 50 MB/saat veri eklemesi
Flash sale: 5 GB/saat veri eklemesi (100x artış!)
```

**Bekleme**: 8 MB/saat artış × 24 saat = 192 MB/gün  
**Gerçek**: Flash sale sırasında ani 3-4 GB artış

### 3. Replication &Persistence Overhead

```
Primary instance: 3 GB
Replica instance: 3 GB (copy)
AOF Persistence: +1 GB (on diskegama yazılan buffer)

Net: 7 GB, oysa "kapasite" 8 GB!
```

## Gerçekçi Kapasite Modeli

```
8 GB Redis Instance
= 8.000 MB

Tahsis:
  - Primary data: 5.000 MB (62%)
  - Replica overvhead: 2.000 MB (25%)
  - Safety margin (eviction): 1.000 MB (13%)
```

**Pratik Kapasite**: ~5 GB = 5.000.000 × 1 KB key-value

## İyileştirme Teknikleri

### 1. Compression

```python
import json
import zlib

data = {"user_id": 123, "name": "Ahmet", ...}
compressed = zlib.compress(json.dumps(data))

redis.set("user:123", compressed)
# 1 KB → ~200 bytes (80% tasarruf!)
```

### 2. Veri Türü Seçimi

```
Kötü:     "user:123:name" = "Ahmet" (30 bytes key + 5 bytes value)
İyi:      "users" (hash) = {123: "Ahmet"} (paylaşılan key overhead)

100.000 user: 3 MB tasarruf!
```

### 3. TTL (Time To Live) Agresifleştirme

```python
# Session'ı her 5 dakika'da refresh et
redis.setex("session:abc", 600, user_session)

# 7 günde eviction olur
# vs.
# Hiç ayarlamaz, sınırsızca birikir
```

## Monitoring

```bash
redis-cli info memory

# Output:
# used_memory: 3.2GB
# used_memory_peak: 3.8GB
# memory_fragmentation_ratio: 1.15
```

- **fragmentation_ratio > 1.3**: Hatalı, memory optimization gerekli
- **used_memory_peak**: En yüksek nokta (hızlı artış varsa dikkat)

## Best Practices

1. ✅ **Her key'e TTL ekleyin** (özellikle session/cache)
2. ✅ **Bellek kullanımını aylık monitor edin**
3. ✅ **Replica'nız varsa x2 kapasite düşünün**
4. ✅ **Persistence output buffer'ını izlemek**
5. ✅ **Spike'lara karşı 30% safety margin bırakın**

## Sonuç

"8 GB Redis" sorusu, teknik bir kalkülasyondan çok daha fazlasıdır. Gerçek büyüme eğrileri, tasarım yanılgıları ve operasyonel overhead'ler dikkate alınmalıdır.

İyi haberler: Bilmek ve planlama yaparsanız, Redis son derece maliyet-verimlidir.
