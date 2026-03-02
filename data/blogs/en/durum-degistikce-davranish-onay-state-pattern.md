---
title: As State Changes, Behavior Changes - State Pattern in Approval Process
excerpt: Learn how to simplify complex state management using the State Pattern
date: 2026-03-01
series: Real Problems, Real Architecture
chapter: 2
tags: [design-patterns, state-pattern, architecture]
---

# As State Changes, Behavior Changes: State Pattern in Approval Process

In the real world, a process (order, application, request) goes through various states. In each state, different operations are allowed. This is where the **State Pattern** comes in.

## Problem: Complex Conditional Logic

Consider an approval process:

```
Start → Pending → Approved → Completed
           ↓
        Rejected
```

### ❌ Without State Pattern

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

**Problems:**
- Condition checks repeated in every method
- Adding a new state requires updating all methods
- Which operation is valid in which state is not clear from the code
- Hard to write tests

### ✅ Using State Pattern

```csharp
// State interface
public interface IApprovalState {
    void Approve(ApprovalRequest request, string approverId);
    void Reject(ApprovalRequest request, string approverId, string reason);
    void Complete(ApprovalRequest request);
    decimal GetProcessingFee(ApprovalRequest request);
    string GetStatusName();
}

// Each state implementation
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

// Main class - much cleaner
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

## Benefits

1. **Open/Closed Principle**: Adding new states doesn't require modifying existing code
2. **Single Responsibility**: Each state manages its own logic
3. **Readability**: It's immediately clear which operations are valid in which state
4. **Testability**: Each state can be tested independently

## Conclusion

State Pattern is the cleanest way to manage state-dependent behavior. It's invaluable in state-heavy systems like financial transactions, order management, and workflows.
