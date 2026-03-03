---
title: 8 GB Redis Gerçekte Kaç Key Taşır?
excerpt: Redis bellek yönetimini anlayıp, gerçekçi kapasite tahminleri yapın
date: 2026-03-03
series: Çalışıyor Ama Kaça Mal Oluyor?
chapter: 1
tags: [redis, performance, optimization, caching, infrastructure]
---

Bu bölümde Redis’in bellek kullanımı ve performans karakteristiklerini, gerçek test verileri üzerinden inceliyoruz.

> **Testler yerel geliştirme ortamında yapıldı.** Production için birebir garanti değil ama kapasite planlaması açısından ciddi bir fikir veriyor.

⚠️ **Not:** Bu değerler referans amaçlıdır. Her sistemin veri yapısı ve kullanım şekli farklıdır. Kendi ortamınızda mutlaka ölçüm ve monitoring yapın.

## 🎯 Test Özeti

**Gerçek veriyle bulk insert senaryosu çalıştırdık ve sonuçlar şöyle:**

Metrik	Değer	Açıklama
Test Verisi	3.603 key	Her key 222 veri objesi içeriyor
Toplam Bellek	~719 MB	Temiz Redis: 1.23 MB → Test sonrası: 718.92 MB
Key Başına Bellek	~204 KB	JSON serileştirilmiş liste
Obje Başına Bellek	~941 byte	Ortalama
Fragmentasyon	0%	Jemalloc allocator çalışıyor
Overhead	%0.14	Neredeyse tüm bellek gerçek veri

Özetle: **222 objelik bir liste yaklaşık 204 KB yer kaplıyor.**

## 💾 Bellek Hesaplaması

Örnek senaryo:

```csharp
// Liste cache'leme
var itemList = new List<ItemDto>(222);
var cacheKey = "APP:List_638993185531593551";

// Bellek Kullanımı:
// ├── JSON: ~204 KB
// ├── Redis key metadata: ~290 byte
// └── Toplam: ~204.3 KB
```

Basit bir hesap:

Tek obje ≈ 941 byte
222 obje ≈ 204 KB
1.000 key ≈ 204 MB

Şimdi iş ciddileşiyor.

## 🧮 8 GB Redis Kaç Key Taşır?

Teorik hesap:

8.192 MB / 204 KB ≈ 40.000 key

Ama production’da %100 doluluk istemezsiniz.

**Güvenli yaklaşım:**
- Fiziksel RAM: 8 GB
- Redis MaxMemory: 6 GB (%75)
- OS ve diğer servisler: 2 GB

**Bu durumda güvenli kapasite yaklaşık 30.000 key civarı olur.**

> Kapasite planlaması tahminle değil, ölçümle yapılır.

## ⏰ TTL Hayati

Redis otomatik temizlik yapmaz. TTL koymazsanız veri kalır.

```csharp
_cacheService.Set("List_123", data, expirationInMinutes: 120);
```

T=0 → Key oluştu (~204 KB)
T=2 saat → Key silindi, bellek geri kazanıldı

**TTL sadece bir özellik değil, bellek yönetim stratejisidir.**

⚠️ **Dikkat:** Bazı client'lar TTL'yi saniye, bazıları dakika olarak alır. Kullandığınız implementasyonu mutlaka kontrol edin.

## 🚨 Eviction Policy Kritik

Test ortamında noeviction vardı.

Production’da risklidir.

Önerilen:

```
allkeys-lru
```

En az kullanılan key’ler otomatik silinir.

Cache veri kaybı tolere edilebiliyorsa bu daha güvenlidir.

## 💽 Persistence Stratejisi

Redis restart olursa ne olacak?

Seçenekler:

Sadece RDB → Hızlı, az disk kullanır, küçük veri kaybı riski

RDB + AOF → Daha güvenli ama disk ve performans maliyeti var

Hiçbiri → Restart’ta tüm veri gider

**Cache senaryolarında genellikle sadece RDB yeterlidir.** TTL zaten geçici veri mantığına uyumludur.

## 📈 Monitoring Olmazsa Kör Uçuş

Production’da en az şu metrikleri izleyin:

used_memory

evicted_keys

hit/miss oranı

fragmentasyon oranı

Fragmentasyon 1.5 üstüne çıkıyorsa alarm düşünülmeli.
Eviction artıyorsa kapasite ya da TTL stratejisi gözden geçirilmeli.

**Sınırı grafikte görmek başka, log'da görmek başkadır.**

## 🎯 Optimizasyon Gerçekten İşe Yarıyor mu?
### 1️⃣ Compression

**JSON'u sıkıştırarak %30–50 tasarruf mümkün.**

204 KB → 120–140 KB

Bu ne demek?

8 GB’ta 40.000 key yerine
60.000+ key mümkün olabilir.

Ama CPU maliyeti artar.

**Bellek mi pahalı, CPU mu?**
Bu karar sistem kullanım profilinize bağlı.

### 2️⃣ Hash Kullanımı

Çok sayıda küçük key yerine Hash kullanmak overhead’i azaltabilir.

Tek tek key yerine:

```
HSET APP:OBJ:Group1 field1 "{json1}"
HSET APP:OBJ:Group1 field2 "{json2}"
```

Yaklaşık %10–15 tasarruf sağlanabilir.

### 3️⃣ Seçici Cache

Her veriyi cache’lemek zorunda değilsiniz.

Büyük, pahalı, sık kullanılan sorguları cache’leyin.
Hızlı ve ucuz sorguları doğrudan DB’den getirmek bazen daha mantıklıdır.

**Cache stratejisi = bilinçli seçim.**

## 📊 Benchmark Özeti

Bellek verimliliği: %99.96

Fragmentasyon: %0

Overhead: %0.14

Key ekleme hızı: ~0.5 key/saniye (test koşullarında)

Genel sistem sağlığı: 9/10

⚠️ **Tek eksik:** Production'da eviction policy mutlaka güncellenmeli.

## 🎓 Çıkarımlar

- **222 obje ≈ 204 KB**
- **8 GB Redis ≈ teorik 40.000 key**
- **TTL zorunlu**
- **Eviction policy production'da doğru ayarlanmalı**
- **Monitoring olmadan kapasite yönetilmez**
- **Büyük objelerde compression ciddi fark yaratır**

**Redis hızlıdır.** Ama sınırsız değildir.

**"Çalışıyor" yeterli değildir.**

Asıl soru şudur: **Kaça mal oluyor?**