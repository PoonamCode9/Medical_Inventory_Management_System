package com.MediStock.app.services;

import com.MediStock.app.dto.NotificationResponse;
import com.MediStock.app.dto.ResolveNotificationRequest;
import com.MediStock.app.entities.Inventory;
import com.MediStock.app.entities.Notification;
import com.MediStock.app.enums.AlertType;
import com.MediStock.app.enums.NotificationStatus;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getAllNotifications();

    NotificationResponse getNotificationById(
            Long notificationId
    );

    List<NotificationResponse> getNotificationsByStatus(
            NotificationStatus status
    );

    List<NotificationResponse> getNotificationsByAlertType(
            AlertType alertType
    );

    Notification createNotification(
            Inventory inventory,
            AlertType alertType
    );

    NotificationResponse reviewNotification(
            Long notificationId,
            ResolveNotificationRequest request
    );

    void deleteNotification(
            Long notificationId
    );

    boolean notificationExists(
            Inventory inventory,
            AlertType alertType
    );

    void synchronizeNotifications();
}