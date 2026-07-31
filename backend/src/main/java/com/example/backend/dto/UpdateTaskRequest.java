package com.example.backend.dto;

import java.time.LocalDate;

public class UpdateTaskRequest {
    private String title;
    private String description;
    private Integer assignedToId;
    private Long relatedPurchaseOrderId;
    private String priority;
    private LocalDate dueDate;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Integer assignedToId) { this.assignedToId = assignedToId; }

    public Long getRelatedPurchaseOrderId() { return relatedPurchaseOrderId; }
    public void setRelatedPurchaseOrderId(Long relatedPurchaseOrderId) { this.relatedPurchaseOrderId = relatedPurchaseOrderId; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}

