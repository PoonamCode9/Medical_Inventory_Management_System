package com.medistock.backend.service.impl;

import com.medistock.backend.entity.Notification;
import com.medistock.backend.service.PushNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushNotificationServiceImpl implements PushNotificationService {

    @Override
    public void sendPushNotification(Notification notification) {
        log.info("PushNotificationService [MOCK]: Preparing push notification payload for Title: '{}'. FCM integration pending.", notification.getTitle());
    }
}
