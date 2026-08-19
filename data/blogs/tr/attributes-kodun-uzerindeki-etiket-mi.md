---
title: "Attribute'lar: Kodun Üzerindeki Etiket Mi, Framework'ün Gizli Komutları Mı?"
excerpt: Framework bunu çalıştırmıyor, siz tarafından yazılan komutları yorumluyor.
date: 2026-08-19
series: Gerçek Problemler, Gerçek Mimari
chapter: 2
tags: [architecture, design, patterns, dotnet, fundamentals]
---

## Bir Gün Bir Endpoint'e Baktım ve Hiç Kod Görmedim

Yeni bir endpoint geliştiren bir ekip arkadaşımızla kod incelemesi yapıyorduk.

Controller'a girdim.

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

Metot neredeyse boştu.

İşin ilginç tarafı sistem çalışıyordu.

Yetki kontrolü yapılıyordu. Validation çalışıyordu. Log kaydı oluşturuluyordu. Swagger dokümantasyonunda endpoint görünüyordu.

Ama bunların hiçbirinin kodu burada değildi.

Merak ettim:

> Peki bütün bunlar nerede çalışıyor?

Cevap büyük ölçüde Attribute'larda gizliydi.

.NET dünyasında Attribute'lar yalnızca kodun üzerine yazılan dekoratif etiketler değildir. Çoğu zaman framework'e verilen talimatlardır. Framework bu talimatları okur, yorumlar ve uygun davranışı uygulamaya geçirir.

Bu yazıda Attribute'ların gerçekten ne olduğunu, nasıl çalıştığını ve neden modern .NET uygulamalarının görünmeyen kahramanlarından biri olduğunu inceleyeceğiz.

## Attribute Nedir?

Bir sınıf yazdığımızı düşünelim.

```csharp
public class UserService
{
}
```

Bu sınıfın içerisinde metodlar olabilir, property'ler olabilir.

Peki ya sınıf hakkında ekstra bilgi vermek istersek?

Örneğin:

- Bu sınıf deprecated mı?
- Yetki gerektiriyor mu?
- API endpoint'i mi?
- Hangi route'a bağlı?
- Swagger'da nasıl görünecek?

Bu bilgiler sınıfın iş mantığı değildir. Ama sistemin davranışını etkiler.

İşte Attribute tam olarak burada devreye girer.

```csharp
[Obsolete]
public class UserService
{
}
```

Bu noktada C# compiler'ı sınıfa ek bir metadata yazar.

Yani aslında olan şey:

> "Bu sınıf hakkında ek bilgi sakla."

demekten ibarettir.

Attribute tek başına hiçbir şey yapmaz. Bu kritik nokta genellikle gözden kaçar.

## Attribute'lar Tek Başlarına Bir Şey Yapmaz

Birçok geliştirici kariyerinin başında şöyle düşünür:

```csharp
[Authorize]
```

yazdım, yetkilendirme çalıştı.

O halde Authorize Attribute yetkilendirme yapıyor.

Aslında hayır.

Authorize Attribute sadece bilgi taşıyor. Asıl işi ASP.NET Core yapıyor.

Request geldiğinde framework:

- Endpoint'i buluyor
- Endpoint üzerindeki Attribute'ları okuyor
- Yetki gerekip gerekmediğini anlıyor
- Gerekli kontrolleri çalıştırıyor

Yani aslında süreç şöyledir:

```text
Request
   ↓
ASP.NET Core Pipeline
   ↓
Attribute'ları Oku
   ↓
Gerekli Mekanizmayı Çalıştır
   ↓
Response
```

Attribute emir vermez. Framework emirleri yorumlar.

Bu ayrım küçük görünse de mimari açıdan çok önemlidir.

## Neden Sürekli Attribute Kullanıyoruz?

Çünkü alternatifi zamanla korkunç hale gelir.

Her action içerisinde yetki kontrolü yaptığımızı varsayalım.

```csharp
public IActionResult Create()
{
    if(!User.IsInRole("Admin"))
    {
        return Forbid();
    }

    // işin gerçek kodu
}
```

Sonra bir endpoint daha. Sonra bir tane daha. Sonra yüz tane daha.

Bir süre sonra uygulamanın her yerinde aynı kod bulunmaktadır.

Tam burada Attribute yaklaşımı devreye girer.

```csharp
[Authorize(Roles = "Admin")]
public IActionResult Create()
{
    // işin gerçek kodu
}
```

Böylece:

- Tekrarlı kod azalır.
- Merkezi yönetim sağlanır.
- Kurallar görünür hale gelir.
- Bakım maliyeti düşer.

Aslında Attribute'ların temel amacı da budur:

> Davranışı kodun içinden çıkarıp deklaratif hale getirmek.

## Deklaratif Programlama

İki farklı yaklaşım düşünelim.

### Imperative (Emirci)

```csharp
if(User.IsInRole("Admin"))
{
    // işlem yap
}
```

Burada sisteme diyorsunuz ki:

> Nasıl yapılacağını ben anlatacağım.

### Declarative (Deklaratif)

```csharp
[Authorize(Roles = "Admin")]
```

Burada ise diyorsunuz ki:

> Ne istediğimi söylüyorum, nasıl yapılacağını sen çöz.

Modern framework'lerin büyük kısmı bu yaklaşım üzerine kuruludur.

ASP.NET Core, Entity Framework, xUnit, Swagger, MediatR... hepsi yoğun şekilde Attribute kullanır.

Çünkü kodun amacı daha görünür hale gelir.

Bir endpoint'e baktığınızda iş kurallarının önemli bir kısmını metodun içine girmeden görebilirsiniz.

## Reflection ve Metadata

Şimdi perdenin arkasına bakalım.

Peki framework bu Attribute'ları nasıl görüyor?

Cevap: **Reflection**

Örneğin:

```csharp
[MyCustom]
public class UserService
{
}
```

Framework çalışma anında şunu yapabilir:

```csharp
var attributes = typeof(UserService).GetCustomAttributes();
```

Sonuç:

```text
MyCustomAttribute
```

Framework artık bu bilgiyi okuyabilir.

Tam olarak bu yüzden Attribute'lar metadata olarak saklanır. Yani kodun içerisine gömülmezler. Ayrı bir bilgi katmanı olarak tutulurlar.

Framework'ün yapabildiği şey de tam olarak budur:

> Metadata'yı oku, yorumla ve uygun davranışı uygula.

Bu nedenle Reflection olmasaydı bugün kullandığımız birçok Attribute mekanizması da var olmayacaktı.

## Kendi Attribute'umuzu Yazabilir Miyiz?

Bu noktada genellikle şu soru gelir:

> Peki kendi Attribute'larımızı nasıl yazıyoruz?

Aslında oldukça basit.

```csharp
[AttributeUsage(AttributeTargets.Method)]
public sealed class AuditLogAttribute : Attribute
{
}
```

Kullanımı:

```csharp
[AuditLog]
public IActionResult Create()
{
    return Ok();
}
```

İlk bakışta büyülü gibi görünür. Ama gerçekte olan şey oldukça sıradandır.

Framework çalışma anında endpoint'i inceler. Endpoint üzerinde `AuditLogAttribute` gördüğünde ilgili mekanizmayı tetikler.

Önemli olan nokta şudur:

Attribute yazmak kolaydır. Asıl zor olan onu yorumlayacak mimariyi oluşturmaktır.

Kurumsal projelerde genellikle işin %10'u Attribute'ın kendisidir. Geri kalan %90 ise onu çalıştıran pipeline'dır.

## Attribute'lar Gerçekte Ne Zaman Çalışır?

Aslında çoğu Attribute'ın kendisi hiçbir zaman çalışmaz.

Bu cümle ilk duyulduğunda garip gelir.

Çünkü çoğu geliştirici aşağıdaki gibi düşünür:

```csharp
[Authorize]
```

yazdım, demek ki bu kod çalışıyor.

Hayır.

Çalışan şey ASP.NET Core'dur.

Pipeline ilgili endpoint'i bulur. Daha sonra endpoint üzerindeki metadata'yı okur.

```text
Request
    ↓
Endpoint Bul
    ↓
Attribute'ları Oku
    ↓
Gerekli Mekanizmaları Çalıştır
    ↓
Action'a Ulaş
```

Bu nedenle Attribute'ı küçük bir komut dosyası gibi değil, metadata nesnesi gibi düşünmek daha doğrudur.

Aslında yazının başlığındaki iki ifade de burada birleşiyor.

Attribute'lar kodun üzerindeki etiketlerdir. Ama aynı zamanda framework bu etiketleri gizli komutlar gibi yorumlar.

İşin sihri Attribute'ta değil, onu okuyup anlamlandıran framework'tedir.

## Attribute'lar Performansı Etkiler Mi?

Her .NET geliştiricisi kariyerinin bir noktasında Reflection'ın yavaş olduğunu duyar.

Sonra ilk custom Attribute'unu yazar ve aklına aynı soru gelir:

> Bunu yüzlerce endpoint'te kullanırsam sistemi yavaşlatır mıyım?

Neyse ki cevap çoğu durumda hayırdır.

Birçok geliştirici maliyetin burada oluştuğunu düşünür:

```csharp
[AuditLog]
```

Oysa gerçek dünyada maliyet genellikle burada değildir.

Asıl maliyet şurada oluşur:

```text
Request
 ↓
Attribute Tespit Edildi
 ↓
Log Mekanizması Çalıştı
 ↓
Database Insert
 ↓
External Service Call
 ↓
Response
```

Attribute'ın okunması belki mikrosaniyeler sürer.

Ancak:

- Veritabanı işlemleri
- Elasticsearch yazımları
- Harici servis çağrıları
- Ağ gecikmeleri
- Dosya sistemi erişimleri

milisaniyeler hatta saniyeler seviyesinde maliyet oluşturabilir.

Yani çoğu senaryoda problem Attribute değildir. Problem Attribute'ın tetiklediği davranıştır.

### Reflection Ne Zaman Problem Olur?

Çoğu kurumsal uygulamada olmaz.

Ancak aşağıdaki gibi bir yaklaşım kullanılıyorsa durum değişebilir.

```csharp
foreach(var type in allTypes)
{
    foreach(var method in type.GetMethods())
    {
        var attrs = method.GetCustomAttributes();
    }
}
```

Ve bu işlem her istekte tekrar tekrar yapılıyorsa gereksiz maliyet oluşabilir.

Bu nedenle modern framework'ler metadata bilgisini önbelleğe alır. Uygulama ayağa kalkarken keşif işlemlerini yapar. Sonrasında mümkün olduğunca hazır veriler üzerinden ilerler.

Bu yüzden günümüzde:

> Attribute kullanmaktan korkmak yerine, gereksiz Reflection kullanımından kaçınmak daha doğru bir yaklaşımdır.

## Attribute ve Middleware İlişkisi

Bu soru neredeyse her ekipte en az bir kez sorulur.

Çünkü her ikisi de request akışını etkiler.

Fakat amaçları farklıdır.

### Middleware

Middleware tüm istekler için çalışır.

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

Örneğin:

- Global Exception Handling
- Request Logging
- Authentication
- CORS
- Response Compression

gibi ihtiyaçlar genellikle middleware seviyesinde çözülür.

Çünkü bunlar tüm uygulamayı ilgilendirir.

### Attribute

Attribute ise daha seçici davranır.

```csharp
[Authorize]
[AuditLog]
public IActionResult Create()
{
}
```

Sadece ilgili endpoint için geçerlidir.

Yani:

- Middleware: Sistemdeki herkese uygulanır.
- Attribute: Sadece istediğim noktaya uygulanır.

### Hangisini Ne Zaman Kullanmalıyız?

Basit bir kural vardır.

Eğer davranış tüm uygulamayı ilgilendiriyorsa:

```text
Middleware
```

Eğer davranış belirli endpoint'leri ilgilendiriyorsa:

```text
Attribute
```

Örneğin:

**Middleware İçin Uygun:**

- Global Exception Handling
- Request Logging
- Correlation Id
- Authentication
- Response Compression

**Attribute İçin Uygun:**

- Authorize
- Audit Log
- Feature Flag
- Rate Limit
- Custom Validation
- Endpoint Bazlı Cache

Bu ayrımı doğru yapmak önemlidir.

Çünkü birkaç yüz endpoint'e ulaşıldığında mimarinin sürdürülebilirliği büyük ölçüde bu kararlarla şekillenir.

## Sonuç

Birçok geliştirici Attribute'ları yalnızca köşeli parantez içerisinde yazılan küçük yapılar olarak görür.

Oysa modern .NET uygulamalarında durum çok farklıdır.

Attribute'lar çoğu zaman:

- Framework ile geliştirici arasındaki iletişim dilidir.
- Metadata taşıyıcısıdır.
- Cross-cutting concern'lerin giriş noktasıdır.
- Deklaratif programlamanın temel taşlarından biridir.
- Kodun davranışını görünür hale getiren mimari araçlardır.

Ve belki de en önemlisi:

> Attribute'lar aslında çalışmazlar. Framework onların yerine çalışır. Fakat framework nasıl davranacağını büyük ölçüde onlardan öğrenir.

Bir dahaki sefere şu kodu gördüğünüzde:

```csharp
[Authorize]
[AuditLog]
[FeatureFlag("WorkTracking")]
[Transaction]
public async Task<IActionResult> Create(...)
```

Action'ın içine girmeden önce bir an durun.

Çünkü muhtemelen sistemin hikayesi metodun içinde değil, çoktan üst satırlarda anlatılmaya başlanmıştır.
