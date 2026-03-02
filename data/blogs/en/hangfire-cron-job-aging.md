---
title: Hangfire & Cron Job & Aging
excerpt: How to manage background jobs, scheduled tasks, and data retention strategies
date: 2026-03-02
series: Real Problems, Real Architecture
chapter: 3
tags: [hangfire, background-jobs, cron, architecture, database]
---

# Hangfire & Cron Job & Aging

Real applications need to perform many tasks outside the main request-response cycle. Sending emails, generating reports, cleaning up data, etc. In this article, we'll discuss how to manage these tasks safely and efficiently.

## Background Jobs: Hangfire

Hangfire is an excellent library for managing background jobs in .NET applications.

### Setup

```bash
dotnet add package Hangfire.Core
dotnet add package Hangfire.SqlServer
```

### Configuration

```csharp
services.AddHangfire(config =>
    config.UseSqlServerStorage("DefaultConnection"));

services.AddHangfireServer();
```

### Usage

```csharp
public class NotificationService {
    public void SendOrderConfirmation(string email, string orderId) {
        // Perform work
        Console.WriteLine($"Email sent to {email}");
    }
}

// Schedule as background job
IBackgroundJobClient jobClient = new BackgroundJobClient();

jobClient.Enqueue(() => 
    notificationService.SendOrderConfirmation("user@example.com", "ORD-12345"));
```

**Advantages:**
- ✅ Job status persisted in database
- ✅ Automatic retry
- ✅ Web UI for monitoring
- ✅ Track job success/failure

## Scheduled Tasks: Cron Expressions

Hangfire also supports Cron expressions:

```csharp
// Run daily at 2 AM
RecurringJob.AddOrUpdate<ReportService>(
    "daily-report",
    x => x.GenerateDailyReport(),
    Cron.Daily(2));

// Every Monday at 8 AM
RecurringJob.AddOrUpdate<DataProcessingService>(
    "weekly-process",
    x => x.ProcessWeeklyData(),
    Cron.WeeklyOnMonday(8));

// Every 5 minutes
RecurringJob.AddOrUpdate<HealthCheckService>(
    "health-check",
    x => x.CheckSystemHealth(),
    Cron.MinuteInterval(5));
```

## Data Aging

Over time, accumulated old data in databases can cause performance issues. We should manage this data with "aging" strategies.

### Strategy 1: Archive Tables

```sql
-- Move data older than 1 year to archive
INSERT INTO LogsArchive (Id, Message, CreatedAt)
SELECT Id, Message, CreatedAt 
FROM Logs 
WHERE CreatedAt < DATEADD(YEAR, -1, GETDATE());

DELETE FROM Logs 
WHERE CreatedAt < DATEADD(YEAR, -1, GETDATE());
```

### Strategy 2: Soft Delete + Cleanup

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

// Run weekly via Hangfire
RecurringJob.AddOrUpdate<DataCleanupService>(
    "archive-old-logs",
    x => x.ArchiveOldLogs(),
    Cron.Weekly(DayOfWeek.Sunday, 3));
```

## Practical Example: Order Cleanup

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

// At startup
RecurringJob.AddOrUpdate<OrderCleanupService>(
    "cleanup-abandoned-orders",
    x => x.CleanupAbandonedOrders(),
    Cron.Daily(1)); // Daily at 1 AM
```

## Tips

1. **Write Idempotent Jobs**: Running the same job twice should be safe
2. **Set Timeouts**: Prevent infinite loops
3. **Log Everything**: Log at the start and end of each job
4. **Monitor**: Keep the Hangfire Dashboard open
5. **Gradual Rollout**: Run large cleanup jobs gradually

## Conclusion

Background jobs, asynchronous operations, and data aging are foundational to modern software. Managing these systems properly becomes critical as your application scales.
