package com.medistock.api.dto;

import com.medistock.api.models.Notification;
import com.medistock.api.models.NotificationStatus;
import com.medistock.api.models.NotificationType;

import java.time.LocalDateTime;

public class NotificationDTO {

    private Long id;
    private String message;
    private NotificationType type;
    private NotificationStatus status;
    private LocalDateTime createdAt;

    public NotificationDTO() {}

    public NotificationDTO(Long id, String message, NotificationType type,
                           NotificationStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static NotificationDTO fromEntity(Notification n) {
        return new NotificationDTO(
                n.getId(),
                n.getMessage(),
                n.getType(),
                n.getStatus(),
                n.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public NotificationStatus getStatus() { return status; }
    public void setStatus(NotificationStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
