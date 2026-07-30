package com.medistock.backend.service;

import java.util.List;

import com.medistock.backend.dto.NotificationDTO;

public interface NotificationService {

    List<NotificationDTO> getAllNotifications();

    NotificationDTO getNotificationById(Integer id);

    List<NotificationDTO> getNotificationsByUser(Integer userId);

    List<NotificationDTO> getUnreadNotifications(Integer userId);

    NotificationDTO createNotification(NotificationDTO dto);

    NotificationDTO updateNotification(Integer id, NotificationDTO dto);

    NotificationDTO markAsRead(Integer id);

    void deleteNotification(Integer id);

    // Automatic Notification
    void createNotification(Integer userId, String message, String notificationType);

}