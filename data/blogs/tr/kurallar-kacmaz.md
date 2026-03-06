---
title: Kurallar Kaçmaz
excerpt: Yazılım mimarisinde değişmeyen temel kurallar ve ilkeler
date: 2026-02-28
series: Gerçek Problemler, Gerçek Mimari
chapter: 1
tags: [architecture, design, patterns, fundamentals]
---

Gerçek bir projede şuna benzer bir durum yaşadık:

**Basit bir rezervasyon modülü yazıyoruz.**

> "Ne var ki bunda?" dedik. Tarih al, kaydet, bitti.

Sonra kurallar gelmeye başladı:

– Geçmiş tarih seçilemez.
– 1 aydan ileri tarih seçilemez.
– Aynı kullanıcı aynı gün ikinci rezervasyon yapamaz.
– API’ye gelen istek null / boş olamaz.

**Kod büyümeden önce şunu fark ettik:**
> Asıl mesele rezervasyon değil.
> Asıl mesele kuralların nerede yaşayacağı.

**Çünkü yanlış yere koyarsan bir gün biri o kuralı bypass eder.**

Ve production'da sürprizler başlar.

## 🧭 Ayrımı Netleştirelim

**Üç Seviye Vardır:**
- **Validation** → Veri düzgün mü?
- **Application** → Sistem içinde çakışma var mı?
- **Domain** → Bu davranış işin doğasına uygun mu?

> Mimarinin özeti şu:
> - Validation veri saçmalamasın diye vardır.
> - Application akışı yönetsin diye vardır.
> - Domain ise sistemin karakteridir.

## 🧱 Domain – Rezervasyonun Karakteri

**Rezervasyon zamansal olarak geçerli değilse zaten oluşmamalı.**

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
            throw new BusinessRuleException("Geçmiş tarih seçilemez.");

        if (date.Date > today.Date.AddMonths(1))
            throw new BusinessRuleException("1 aydan ileri tarih seçilemez.");

        Date = date.Date;
    }
}
```

Burada kritik nokta şu:
> **Rezervasyon nesnesi kendi bütünlüğünü kendi koruyor.**

Kim çağırırsa çağırsın. API, background job, CLI tool… fark etmez.

## ⚙️ Application – Sistem Çakışmaları

**"Aynı kullanıcı aynı gün ikinci rezervasyon yapamaz" kuralı ise DB kontrolü gerektiriyor.**

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
            throw new BusinessRuleException("Aynı gün için zaten rezervasyon mevcut.");

        var reservation = new Reservation(userId, date, today);

        await _repository.AddAsync(reservation);
    }
}
```

Application katmanı orkestrasyon yapıyor.
Akışı yönetiyor.
**Ama domain'in yerine geçmiyor.**

## 🛡️ Validation – Kapıdaki Güvenlik

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

Bu sadece filtre.
**Henüz iş mantığı değil.**

## 🎛️ Controller?

**Controller hiçbir şey bilmiyor.**
- DB bilmiyor.
- Kural bilmiyor.
- Sadece servisi çağırıyor.

> **Aptal controller, akıllı domain. 🧠**

## ❓ Asıl Soru

Yarın biri Reservation entity’sini new’leyip Date’i public set edebilse ne olur?

**Tasarım delinmiştir. 🚨**

Ama davranış üzerinden zorunlu kılıyorsan, sistem kendini savunur.

### ✅ İyi Mimarinin Ölçütü

> **Kural atlanamaz olmalı.**

Bu seride gerçek hayatta karşılaştığım problemleri ve uyguladığımız mimari çözümleri paylaşacağım.

**Başta basit olacak.** Sonra concurrency, distributed senaryolar, idempotency, domain event'ler gibi daha karmaşık konulara gireceğiz.

> **Çünkü gerçek mimari, PowerPoint'te değil; edge case'lerde belli olur. 🔍**

---

**Yazılımda en güçlü kod, hata yapmayı zorlaştıran koddur. 💪**