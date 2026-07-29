package com.medistock.backend.service;

import com.medistock.backend.entity.Notification;
import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsForUser(String email);
    Notification createNotification(String email, String title, String message, String type, String priority, String relatedModule, Integer relatedEntityId);
    void markAsRead(Integer id);
    void markAllAsRead(String email);
    void deleteNotification(Integer id);
    List<Notification> getUnreadNotificationsForUser(String email);
    long getUnreadCountForUser(String email);
    List<Notification> filterNotifications(String email, String type, Boolean isRead);
    List<Notification> searchNotifications(String email, String query);
    void clearReadNotifications(String email);
}
