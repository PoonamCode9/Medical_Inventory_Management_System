package com.example.backend;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to", nullable = false)
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "related_purchase_order_id")
    private Long relatedPurchaseOrderId;

    @Column(nullable = false, length = 10)
    private String priority; // LOW, MEDIUM, HIGH

    @Column(nullable = false, length = 10)
    private String status; // PENDING, COMPLETED

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
        if (priority == null) priority = "MEDIUM";
    }

    @PreUpdate
    public void preUpdate() {
        if ("COMPLETED".equals(status) && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }

    // Constructors
    public Task() {}

    public Task(String title, String description, User assignedTo, User createdBy,
                String priority, String status, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public Long getRelatedPurchaseOrderId() { return relatedPurchaseOrderId; }
    public void setRelatedPurchaseOrderId(Long relatedPurchaseOrderId) { this.relatedPurchaseOrderId = relatedPurchaseOrderId; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}

