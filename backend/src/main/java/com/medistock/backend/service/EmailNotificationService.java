package com.medistock.backend.service;

import com.medistock.backend.entity.Notification;

public interface EmailNotificationService {
    void sendEmailNotification(String recipientEmail, Notification notification);
}
