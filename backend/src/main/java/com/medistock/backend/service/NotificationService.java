package com.medistock.backend.service;

import com.medistock.backend.model.Notification;
import java.util.List;

public interface NotificationService {
    List<Notification> getUnreadNotifications();
    List<Notification> getAllNotifications();
    void createNotification(String message, String type);
    void markAsRead(Long id);
    void markAllAsRead();
    void checkLowStockAndCreateNotifications();
    void checkExpiryAndCreateNotifications();
}
