package com.medistock.backend.service;

import com.medistock.backend.entity.Notification;

public interface PushNotificationService {
    void sendPushNotification(Notification notification);
}
