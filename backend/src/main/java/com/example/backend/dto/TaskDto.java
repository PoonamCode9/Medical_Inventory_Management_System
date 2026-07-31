package com.example.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDto {
    private Long taskId;
    private String title;
    private String description;
    private Integer assignedToId;
    private String assignedToName;
    private Integer createdById;
    private String createdByName;
    private Long relatedPurchaseOrderId;
    private String priority;
    private String status;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    // Getters and Setters
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Integer assignedToId) { this.assignedToId = assignedToId; }

    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }

    public Integer getCreatedById() { return createdById; }
    public void setCreatedById(Integer createdById) { this.createdById = createdById; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

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

