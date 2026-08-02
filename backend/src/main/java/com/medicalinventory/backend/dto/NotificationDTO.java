package com.medicalinventory.backend.dto;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Long notificationId;
    private String medicineName;
    private String notificationType;
    private String message;
    private String notificationMode;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDTO() {
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNotificationMode() {
        return notificationMode;
    }

    public void setNotificationMode(String notificationMode) {
        this.notificationMode = notificationMode;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    

    
}
