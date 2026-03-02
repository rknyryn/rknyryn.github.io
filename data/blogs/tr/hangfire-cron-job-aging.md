---
title: Hangfire & Cron Job & Aging
excerpt: Arkaplan işlerini, zamanlanmış görevleri ve veri yaşlandırma stratejilerini nasıl yönetiriz?
date: 2026-03-02
series: Gerçek Problemler, Gerçek Mimari
chapter: 3
tags: [hangfire, background-jobs, cron, architecture, database]
---

# Hangfire & Cron Job & Aging

Gerçek uygulamalar, ana istek-yanıt döngüsü dışında pek çok işi yapmak gerektirir. Email gönderme, rapor üretme, veri temizleme, vs. Bu yazıda bu işleri nasıl güvenli ve verimli şekilde yönetileceğini konuşacağız.

## Arkaplan İşleri: Hangfire

Hangfire, .NET uygulamalarında arkaplan işlerini yönetmek için harika bir kütüphane.

### Kurulum

```bash
dotnet add package Hangfire.Core
dotnet add package Hangfire.SqlServer
```

### Konfigürasyon

```csharp
services.AddHangfire(config =>
    config.UseSqlServerStorage("DefaultConnection"));

services.AddHangfireServer();
```

### Kullanım

```csharp
public class NotificationService {
    public void SendOrderConfirmation(string email, string orderId) {
        // Bu işi hemen yap
        Console.WriteLine($"Email sent to {email}");
    }
}

// Arkaplan işi olarak
IBackgroundJobClient jobClient = new BackgroundJobClient();

jobClient.Enqueue(() => 
    notificationService.SendOrderConfirmation("user@example.com", "ORD-12345"));
```

**Avantajları:**
- ✅ Database'de job durumu kaydedilir
- ✅ Otomatik retry
- ✅ Web UI ile monitoring
- ✅ İşin başarısı/başarısızlığını takip edebiliriz

## Zamanlanmış Görevler: Cron Expressions

Hangfire, Cron expressions'ı da destekler:

```csharp
// Her gün saat 2'de çalışan job
RecurringJob.AddOrUpdate<ReportService>(
    "daily-report",
    x => x.GenerateDailyReport(),
    Cron.Daily(2));

// Her pazartesi sabah 8'de
RecurringJob.AddOrUpdate<DataProcessingService>(
    "weekly-process",
    x => x.ProcessWeeklyData(),
    Cron.WeeklyOnMonday(8));

// Her 5 dakikada bir
RecurringJob.AddOrUpdate<HealthCheckService>(
    "health-check",
    x => x.CheckSystemHealth(),
    Cron.MinuteInterval(5));
```

## Veri Yaşlandırma (Data Aging)

Veritabanlarında, zaman içinde biriken eski veriler performans sorununa yol açabilir. Bu verileri "yaşlandırma" stratejileriyle yönetmeliyiz.

### Strateji 1: Archive Tabloları

```sql
-- Log tablosunda 1 yıldan eski verileri archive'ye taşı
INSERT INTO LogsArchive (Id, Message, CreatedAt)
SELECT Id, Message, CreatedAt 
FROM Logs 
WHERE CreatedAt < DATEADD(YEAR, -1, GETDATE());

DELETE FROM Logs 
WHERE CreatedAt < DATEADD(YEAR, -1, GETDATE());
```

### Strateji 2: Soft Delete + Cleanup

```csharp
public class DataCleanupService {
    private readonly IRepository<LogEntry> _logs;
    
    public void ArchiveOldLogs() {
        var cutoffDate = DateTime.UtcNow.AddYears(-1);
        var oldLogs = _logs.GetAll()
            .Where(l => l.CreatedAt < cutoffDate)
            .ToList();
        
        // Archive to separate storage
        _archiveService.Archive(oldLogs);
        
        // Soft delete
        foreach (var log in oldLogs) {
            log.IsArchived = true;
            log.ArchivedAt = DateTime.UtcNow;
            _logs.Update(log);
        }
    }
}

// Hangfire ile haftada bir çalıştır
RecurringJob.AddOrUpdate<DataCleanupService>(
    "archive-old-logs",
    x => x.ArchiveOldLogs(),
    Cron.Weekly(DayOfWeek.Sunday, 3));
```

## Pratik Örnek: Order Cleanup

```csharp
public class OrderCleanupService {
    private readonly IOrderRepository _orders;
    private readonly ILogger<OrderCleanupService> _logger;
    
    [AutomaticRetry(Attempts = 3)]
    public void CleanupAbandonedOrders() {
        try {
            var cutoff = DateTime.UtcNow.AddDays(-7);
            var abandoned = _orders.GetAll()
                .Where(o => o.Status == OrderStatus.Pending && o.CreatedAt < cutoff)
                .ToList();
            
            foreach (var order in abandoned) {
                order.Status = OrderStatus.Cancelled;
                order.CancelledAt = DateTime.UtcNow;
                order.CancelReason = "Auto-cancelled due to inactivity";
            }
            
            _orders.SaveChanges();
            _logger.LogInformation($"Cleaned up {abandoned.Count} abandoned orders");
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Failed to cleanup abandoned orders");
            throw; // Hangfire will retry
        }
    }
}

// Startup'ta
RecurringJob.AddOrUpdate<OrderCleanupService>(
    "cleanup-abandoned-orders",
    x => x.CleanupAbandonedOrders(),
    Cron.Daily(1)); // Her gün saat 1'de
```

## İpuçları

1. **İdempotent İşler Yazın**: Aynı işi iki kez çalıştırmak güvenli olmalı
2. **Timeout Ayarlayın**: Sonsuz döngüler engellenmeli
3. **Logging**: Her job başında ve sonunda log atın
4. **Monitoring**: Hangfire Dashboard'ı açık tutun
5. **Gradual Rollout**: Büyük cleanup işlerini yavaş yavaş yap

## Sonuç

Arkaplan işleri, asenkron operasyonlar ve veri yaşlandırması, modern yazılımın temel taşlarıdır. Bu sistemleri doğru yönetmek, uygulamanız ölçeklendikçe hayati öneme sahiptir.
