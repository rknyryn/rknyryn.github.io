---
title: "HTTP Cache, REST ve RPC: Mimari Karar Rehberi"
excerpt: Veri tutarlılığı ve performansı dengelemek için cache stratejisini nasıl seçersiniz?
date: 2026-08-19
series: Gerçek Problemler, Gerçek Mimari
chapter: 3
tags: [architecture, http, cache, rest, rpc, performance]
---

## Ne Zaman Cache Kullanmalıyız?

HTTP cache (browser ve CDN tarafından) performans için güçlü bir mekanizmadır.

Ama her durumda kullanılması doğru değildir.

Cache kullanımı mimari tercih değil. Veri tutarlılığı ve iş ihtiyacına bağlı bir karardır.

### Temel Karar Kuralı

Başta bir soruyu sorun kendinize:

> "Bu veri belirli bir süre eski olsa sorun olur mu?"

- **Hayır** → Cache kullan
- **Evet** → Cache kullanma

Başka hiçbir şey bu kadar basittir. Ama çoğu zaman bu soruyu sormazsınız.

### Cache Kullanılması Gereken Durumlar

- Ürün liste ve detay sayfaları (aynı veri sık tekrar istenir)
- Blog ve içerik (nadiren değişir)
- Public API GET endpoint'leri (CDN ciddi yük azaltır)
- Statik dosyalar (JS, CSS)

### Cache Kullanılmaması Gereken Durumlar

- Admin panel (ekle/sil/güncelle) — stale data kritik hata yaratır
- Kullanıcıya özel veri — yanlış kullanıcıya veri dönebilir
- Anlık veri (stok, bakiye, hesap) — güncellik zorunludur
- Dashboard ve realtime veri — gecikme kabul edilemez

Basit göründüğü halde, ekiplerin %70'i bu kararı sezgisel olarak veriyorlar.

Sonra production'da stale data problemi ile yüzleşiyorlar.

## Bir HTTP İsteği Attığımızda Arka Planda Ne Olur?

Şu akışı hayal edin:

```
Kullanıcı (Tarayıcı) → CDN → Origin Server (API)
```

### İlk İstek

Tarayıcı şu isteği atar:

```http
GET /api/products/123 HTTP/1.1
Host: api.example.com
```

Adım adım:

1. Tarayıcı kendi cache'sine bakar. İlk istekte kayıt yoktur.
2. İstek CDN'e gider. CDN de cache'te bulamaz ve origin server'a iletir.
3. Origin server response döner.

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

4. Tarayıcı ve CDN bu response'u cache eder (eğer header'lar izin veriyorsa).

**Önemli nokta:** Cache davranışı tamamen sunucunun gönderdiği HTTP header'lara bağlıdır. Otomatik bir davranış değildir.

## Cache Header'ları Ne Anlama Gelir?

### Cache-Control

```http
Cache-Control: public, max-age=60
```

Direktiflerin anlamı:

- `public` → Tarayıcı ve CDN dahil herkes cache'leyebilir
- `private` → Yalnızca tarayıcı cache'ler
- `max-age=60` → 60 saniye geçerlidir
- `no-cache` → Cache'le, ama her seferinde sunucuya doğrulat
- `no-store` → Hiç cache'leme

Örneğin `no-store` kullanılırsa:

```http
Cache-Control: no-store
```

Hiçbir şey cache'lenmez. Her istek sunucuya gider.

### ETag

ETag, sunucunun o veriye atadığı bir "parmak izi"dir.

```http
ETag: "d4f8a3b2"
```

İçerik değiştiğinde ETag de değişir.

## İkinci İstek: Cache Devrede

60 saniye dolmadan aynı URL'e tekrar istek atıldığında:

```
Kullanıcı → Tarayıcı "Bende bu veri var, sana vereyim"
```

Sunucuya istek bile gitmez. Tarayıcı cache'ten döner.

Daha hızlıdır.

Sunucu yüksüz kalır.

Ağ trafiği azalır.

## Cache Süresi Dolarsa: Doğrulama

60 saniye dolduktan sonra aynı URL'e istek atıldığında:

```http
GET /api/products/123 HTTP/1.1
If-None-Match: "d4f8a3b2"
```

Sunucu durumu kontrol eder.

**Veri değişmediyse:**

```http
HTTP/1.1 304 Not Modified
```

Tarayıcı cache'teki veriyi tutar.

**Veri değiştiyse:**

```http
HTTP/1.1 200 OK
ETag: "yeni-etag"
Cache-Control: public, max-age=60
```

Yeni veri döner ve yeniden cache'lenir.

## Stale Data Problemi

Cache süresi dolmadan veri değişirse:

```
Sunucu:    yeni veri
Tarayıcı:  eski veri
```

Bu kritiktir.

Özellikle fiyat, bakiye, stok gibi verilerde.

### Çözüm Stratejileri

**1. Kısa max-age**

```http
Cache-Control: public, max-age=5
```

Her 5 saniyede güncellenir. Ama CDN'e daha fazla yük düşer.

**2. no-cache Direktifi**

```http
Cache-Control: no-cache
```

Cache'lenir ama her seferinde sunucuya doğrulama isteği gider (304 kontrollü).

**3. no-store**

```http
Cache-Control: no-store
```

Hiç cache'lenmez. En güvenli ama en yavaş.

**4. Cache Busting**

```
/products/123?v=2
```

URL'e parametre ekleyerek yeni istek oluşturursunuz.

## REST Nedir ve Cache ile İlişkisi

REST kaynak odaklı bir mimaridir.

```http
GET    /api/products
GET    /api/products/123
POST   /api/products
PUT    /api/products/123
DELETE /api/products/123
```

Her kaynak (resource) sabit bir URL'ye sahiptir.

### REST ile Cache

GET istekleri cachelenmeye uygundur.

Çünkü GET istekleri veri değiştirmez.

Aynı URL tekrar tekrar aynı veriyi döner.

Bu tutarlı URL yapısı, cache'in etkili bir şekilde çalışmasını sağlar.

Ama REST kullanmak cache'i otomatik sağlamaz.

Cache davranışı tamamen şuna bağlıdır:

- `Cache-Control` header
- `ETag`
- CDN konfigürasyonu

REST sadece cache için daha uygun ve stabil bir URL yapısı sunar.

## RPC Nedir ve Cache ile İlişkisi

RPC (Remote Procedure Call) aksiyon odaklı bir mimaridir.

```http
GET  /api/products/GetById?id=123
GET  /api/products/GetAll
POST /api/products/CreateProduct
POST /api/products/DeleteProduct
POST /api/products/UpdatePrice?id=123&price=999
```

Metot isimlerini URL'ye yerleştirir.

### RPC ile Cache: Yaygın Yanlış

Çoğu geliştirici düşünür:

> RPC cachelenmez.

Yanlıştır.

RPC de cachelenebilir. Cache tamamen HTTP kurallarına bağlıdır, mimariye değil.

### Gerçek Fark

**a) Query String Problemi**

```
/api/products/GetById?id=123
/api/products/GetById?id=456
```

Her parametre kombinasyonu ayrı cache entry'dir. CDN'de cache hit ratio düşer.

**b) POST Kullanımı**

```http
POST /api/products/GetById
```

POST default olarak cachelenmez.

**c) URL Tutarlılığı**

```http
GET /api/products/GetById/123
```

REST'e kıyasla daha az tutarlıdır. Cache key varyasyonu artar.

## REST vs RPC: Detaylı Analiz

### Tarayıcı Açısından

**GET request:** Her iki yapıda da cachelenebilir.

**POST request:** Her iki yapıda da cachelenmez.

Fark yok.

### CDN Açısından

Her ikisi de cachelenebilir.

Ama **cache hit ratio** farklıdır.

```
/products/123        → tek cache key (REST)
/products?id=123     → varyasyonlu cache key (RPC)
```

REST daha yüksek cache hit sağlar.

Neden? Çünkü URL yapısı tutarlı ve öngörülebilirdir.

RPC'de query string ve parametre varyasyonları cache'i parçalar.

## CDN Cache Key Nasıl Optimize Edilir?

Amacınız:

- Cache hit ratio artırmak
- Cache key sayısını azaltmak

### Strateji 1: Gereksiz Query Parametrelerini Kaldır

```
/products/123        ✔️  (cache hit yüksek)
/products?id=123     ⚠️  (cache hit düşük)
```

### Strateji 2: Sadece Gerekli Parametreleri Dahil Et

CDN konfigürasyonunda sadece gerekli parametreleri cache key'e dahil edin.

Örneğin `id` ve `lang` gerekli ama `utm_source` gerekmiyorsa:

```
cache key = /products + id + lang
```

### Strateji 3: Header Varyasyonunu Azalt

`Authorization` veya `Accept-Language` gibi header'lar cache'i parçalar.

Eğer mümkünse parametreyi URL'ye taşıyın.

### Strateji 4: Path-based Tasarım Kullan

```
/products/123/en        ✔️  (path-based)
/products/123?lang=en   ⚠️  (query string)
```

Path-based tasarım daha iyi cache hit sağlar.

### Strateji 5: TTL Doğru Ayarla

Her veri türü için uygun TTL seçin:

- **Statik dosya (JS, CSS):** 1 yıl
- **Ürün detay:** 60 saniye
- **Ürün listesi:** 30 saniye
- **Blog yazısı:** 1 saat
- **Kullanıcı verisi:** cache'lemeyin

## ASP.NET Core ile Cache Nasıl Ayarlanır?

### Basit Kullanım

```csharp
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public IActionResult GetProduct(int id)
{
    return Ok(/* data */);
}
```

### Manuel Header Kontrolü

```csharp
public IActionResult GetProduct(int id)
{
    Response.Headers["Cache-Control"] = "public,max-age=60";
    return Ok(/* data */);
}
```

### ETag Kullanımı

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

### Cache Devre Dışı Bırakma

```csharp
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public IActionResult GetSensitiveData()
{
    return Ok(/* data */);
}
```

## Pragmatik Kullanım

Gerçek dünya şöyledir:

```http
POST /api/orders/123/approve
POST /api/orders/123/cancel
POST /api/payments/456/refund
GET  /api/reports/monthly-summary
```

Saf REST'i çiğnemek gerekiyorsa çiğneyin.

Ama cache stratejisini yanında unutmayın.

Birkaç POST endpoint'i etrafında hareket edebilir ve GET'leri cache'leyebilirsiniz.

## Karar Rehberi

Hangi mimariyi, hangi durumda seçmelisiniz?

**CRUD operasyonları → REST**
HTTP verb'ler uyumlu.

**Public API → REST**
Standart ve cache uyumlu.

**Yüksek trafikli okuma → REST**
CDN avantajı.

**Aksiyon işlemleri → Hibrit**
Daha doğal.

**Realtime veri → Her ikisi**
Cache devre dışı.

## Sonuç

Cache, REST ve RPC hakkında hatırlanması gereken en önemli üç nokta:

1. **Cache davranışı HTTP header'lara bağlıdır.** Mimariye değil. REST veya RPC seçimi cache'i garantilemez.

2. **Cache davranışı iş ihtiyacına bağlı bir karardır.** Teknolojiye değil. "Bu veri eski olabilir mi?" sorusunu sorun.

3. **Mimari seçim cache verimliliğini etkiler.** REST daha iyi cache hit sağlar. Ama istediğiniz sonuca ulaşmak için her ikisini de karıştırabilirsiniz.

Bir endpoint yazarken şu düşünün:

- Bu veri ne kadar eski olabilir?
- Kaç defa çağrılacak?
- CDN'den yararlanabilir miyim?
- Stale data riski var mı?

Bu sorulara cevap verdikten sonra, cache stratejisini belirleyin.

Ardından mimariyi seçin.

Tersi değil.
