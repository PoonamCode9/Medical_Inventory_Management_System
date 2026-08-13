package com.medistock.service;

import java.util.List;
import com.medistock.entity.Notification;

public interface NotificationService {

    Notification addNotification(Notification notification);

    List<Notification> getAllNotifications();

    Notification getNotificationById(Long id);

    Notification updateNotification(Long id, Notification notification);

    void deleteNotification(Long id);
    void checkLowStock();
    void checkExpiry();
}