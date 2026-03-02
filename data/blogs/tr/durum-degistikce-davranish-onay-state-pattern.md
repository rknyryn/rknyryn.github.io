---
title: Durum Değiştikçe Davranış da Değişir - Onay Sürecinde State Pattern
excerpt: State Pattern'i kullanarak karmaşık durum yönetimini nasıl basitleştireceğimizi öğrenin
date: 2026-03-01
series: Gerçek Problemler, Gerçek Mimari
chapter: 2
tags: [design-patterns, state-pattern, architecture]
---

# Durum Değiştikçe Davranış da Değişir: Onay Sürecinde State Pattern

Gerçek dünyada, bir işlem (order, application, request) çeşitli durumlardan geçer. Her durumda, izin verilen işlem farklıdır. İşte bu noktada **State Pattern** devreye girer.

## Problem: Karmaşık Koşul Kontrolü

Bir onay sürecini ele alalım:

```
Başlangıç → Beklemede → Onaylandı → Tamamlandı
                ↓
            Reddedildi
```

### ❌ State Pattern Olmadan

```csharp
public class ApprovalRequest {
    public string Status { get; set; } // "pending", "approved", "rejected", "completed"
    public decimal Amount { get; set; }
    
    public void Approve(string approverId) {
        if (Status != "pending") {
            throw new InvalidOperationException("Only pending requests can be approved");
        }
        Status = "approved";
    }
    
    public void Reject(string approverId, string reason) {
        if (Status != "pending") {
            throw new InvalidOperationException("Only pending requests can be rejected");
        }
        Status = "rejected";
    }
    
    public void Complete() {
        if (Status != "approved") {
            throw new InvalidOperationException("Only approved requests can be completed");
        }
        Status = "completed";
    }
    
    public decimal GetProcessingFee() {
        switch (Status) {
            case "pending": return 0;
            case "approved": return Amount * 0.02m;
            case "completed": return Amount * 0.02m;
            case "rejected": return 0;
            default: throw new InvalidOperationException();
        }
    }
}
```

**Sorunlar:**
- Koşul kontrolü her metotta tekrarlanıyor
- Durum eklenince, tüm metodları güncellememiz gerekiyor
- Hangi işlem hangi durumda yapılabilir, koddan görülmüyor
- Test yazması zor

### ✅ State Pattern Kullanarak

```csharp
// Durum arayüzü
public interface IApprovalState {
    void Approve(ApprovalRequest request, string approverId);
    void Reject(ApprovalRequest request, string approverId, string reason);
    void Complete(ApprovalRequest request);
    decimal GetProcessingFee(ApprovalRequest request);
    string GetStatusName();
}

// Her durum için sınıf
public class PendingState : IApprovalState {
    public void Approve(ApprovalRequest request, string approverId) {
        request.SetState(new ApprovedState());
    }
    
    public void Reject(ApprovalRequest request, string approverId, string reason) {
        request.SetState(new RejectedState());
    }
    
    public void Complete(ApprovalRequest request) {
        throw new InvalidOperationException("Cannot complete a pending request");
    }
    
    public decimal GetProcessingFee(ApprovalRequest request) => 0;
    public string GetStatusName() => "Pending";
}

public class ApprovedState : IApprovalState {
    public void Approve(ApprovalRequest request, string approverId) {
        throw new InvalidOperationException("Already approved");
    }
    
    public void Reject(ApprovalRequest request, string approverId, string reason) {
        throw new InvalidOperationException("Cannot reject an approved request");
    }
    
    public void Complete(ApprovalRequest request) {
        request.SetState(new CompletedState());
    }
    
    public decimal GetProcessingFee(ApprovalRequest request) => request.Amount * 0.02m;
    public string GetStatusName() => "Approved";
}

public class CompletedState : IApprovalState {
    public void Approve(ApprovalRequest request, string approverId) 
        => throw new InvalidOperationException("Already completed");
    
    public void Reject(ApprovalRequest request, string approverId, string reason) 
        => throw new InvalidOperationException("Cannot reject a completed request");
    
    public void Complete(ApprovalRequest request) 
        => throw new InvalidOperationException("Already completed");
    
    public decimal GetProcessingFee(ApprovalRequest request) => request.Amount * 0.02m;
    public string GetStatusName() => "Completed";
}

// Ana sınıf - çok daha temiz
public class ApprovalRequest {
    private IApprovalState _currentState;
    public decimal Amount { get; set; }
    
    public ApprovalRequest() {
        _currentState = new PendingState();
    }
    
    public void SetState(IApprovalState state) => _currentState = state;
    
    public void Approve(string approverId) => _currentState.Approve(this, approverId);
    public void Reject(string approverId, string reason) => _currentState.Reject(this, approverId, reason);
    public void Complete() => _currentState.Complete(this);
    public decimal GetProcessingFee() => _currentState.GetProcessingFee(this);
    public string GetStatus() => _currentState.GetStatusName();
}
```

## Faydaları

1. **Açık/Kapalı Prensibi**: Yeni durum eklerken mevcut kodu değiştirmiyoruz
2. **Tek Sorumluluk**: Her durum kendi mantığından sorumlu
3. **Okunabilirlik**: Hangi işlem hangi durumda mümkün, açıkça görülüyor
4. **Test Edilebilirlik**: Her durumu ayrı test edebiliriz

## Sonuç

State Pattern, durum-bağımlı davranışı yönetmenin en temiz yoludur. Özellikle finansal işlemler, order yönetimi, workflow gibi durum-heavy sistemlerde paha biçilmezdir.
