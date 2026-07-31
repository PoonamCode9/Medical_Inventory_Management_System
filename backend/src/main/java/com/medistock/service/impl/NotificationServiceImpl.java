package com.medistock.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.entity.Notification;
import com.medistock.repository.NotificationRepository;
import com.medistock.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Notification addNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    @Override
    public Notification updateNotification(Long id, Notification notification) {

        Notification existing = notificationRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setTitle(notification.getTitle());
            existing.setMessage(notification.getMessage());
            existing.setDate(notification.getDate());

            return notificationRepository.save(existing);
        }

        return null;
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}