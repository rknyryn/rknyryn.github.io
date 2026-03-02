---
title: Kurallar Kaçmaz
excerpt: Yazılım mimarisinde değişmeyen temel kurallar ve ilkeler
date: 2026-02-28
series: Gerçek Problemler, Gerçek Mimari
chapter: 1
tags: [architecture, design, patterns, fundamentals]
---

# Kurallar Kaçmaz

Yazılım mimarisinin temelinde yatan bazı kurallar vardır. Bu kurallar, deneyim kazandıkça halkında ne kadar çok proje yönetsen de, hatta teknoloji ne kadar değişse de hep aynı kalır.

## Temel Kurallar

### 1. Separation of Concerns (SoC)
Her bileşen tek bir sorumluluğa sahip olmalıdır. İş mantığı, veri erişimi, sunum mantığı birbirinden ayrılmalıdır.

```csharp
// ❌ Kötü - Tüm mantık bir yerde
public class OrderService {
    public void ProcessOrder(Order order) {
        // Validation
        if (order.Total <= 0) return;
        
        // Database
        database.Save(order);
        
        // Email
        emailService.Send($"Order processed: {order.Id}");
        
        // Logging
        logger.Info($"Order {order.Id} processed");
    }
}

// ✅ İyi - Sorumluluklar ayrılmış
public class OrderValidator {
    public bool IsValid(Order order) => order.Total > 0;
}

public class OrderRepository {
    public void Save(Order order) => database.Save(order);
}

public class OrderNotificationService {
    public void NotifyProcessed(Order order) => emailService.Send(...);
}

public class OrderService {
    public void ProcessOrder(Order order) {
        if (!validator.IsValid(order)) return;
        repository.Save(order);
        notificationService.NotifyProcessed(order);
    }
}
```

### 2. DRY (Don't Repeat Yourself)
Aynı kodu birden fazla yerde yazmayın. Kod tekrarı, bakım sorunlarına ve tutarsızlıklara yol açar.

### 3. SOLID Prensipleri
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

## Neden Bu Kadar Önemli?

- **Bakım Kolaylığı**: Kod değiştirmek daha kolay ve güvenli
- **Test Edilebilirlik**: Sınıfları izole etmek testleri kolay kılar
- **Esneklik**: Yeni gereksinimler karşılamak daha az çabaya mal olur
- **Takım Çalışması**: Kod temizliği, ekibin verimini arttırır

## Sonuç

Bu kurallar kısa vadede biraz fazla görünebilir. Ancak, 6 ay sonra o kodu değiştirmen gerektiğinde, ya da bir bug fix yaparken başka bir sistemin kırılmadığını emin olmak istediğinde, bu kuralların değerini anlayacaksın.

Temiz kod yazma alışkanlığı, ne tür bir projeyle çalışırsan çalış, her zaman seni kurtaracaktır.
