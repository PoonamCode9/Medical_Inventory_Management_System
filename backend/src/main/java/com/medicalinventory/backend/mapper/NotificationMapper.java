package com.medicalinventory.backend.mapper;

import com.medicalinventory.backend.dto.NotificationDTO;
import com.medicalinventory.backend.entity.Notification;

public class NotificationMapper {
    public static NotificationDTO toDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();

        dto.setNotificationId(notification.getNotificationId());
        if (notification.getMedicine() != null) {
            dto.setMedicineName(notification.getMedicine().getMedicineName());
        } else {
            dto.setMedicineName("N/A"); 
        }
        dto.setNotificationType(notification.getNotificationType());
        dto.setMessage(notification.getMessage());
        dto.setNotificationMode(notification.getNotificationMode());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        return dto;
    }
}
