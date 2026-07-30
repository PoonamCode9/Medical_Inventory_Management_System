package com.medistock.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.NotificationDTO;
import com.medistock.backend.entity.Notification;
import com.medistock.backend.entity.User;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public List<NotificationDTO> getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    @Override
public void createNotification(Integer userId,
                               String message,
                               String notificationType) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Notification notification = new Notification();

    notification.setUser(user);
    notification.setMessage(message);
    notification.setNotificationType(notificationType);
    notification.setIsRead(false);
    notification.setCreatedAt(LocalDateTime.now());

    notificationRepository.save(notification);
}

    @Override
    public NotificationDTO getNotificationById(Integer id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        return convertToDTO(notification);
    }

    @Override
    public NotificationDTO createNotification(NotificationDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setMessage(dto.getMessage());
        notification.setNotificationType(dto.getNotificationType());
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return convertToDTO(notificationRepository.save(notification));
    }

    @Override
    public NotificationDTO updateNotification(Integer id, NotificationDTO dto) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setMessage(dto.getMessage());
        notification.setNotificationType(dto.getNotificationType());
        notification.setIsRead(dto.getIsRead());

        return convertToDTO(notificationRepository.save(notification));
    }

    @Override
    public void deleteNotification(Integer id) {

        notificationRepository.deleteById(id);
    }

    @Override
    public List<NotificationDTO> getNotificationsByUser(Integer userId) {

        return notificationRepository.findByUser_UserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationDTO markAsRead(Integer id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);

        return convertToDTO(notificationRepository.save(notification));
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications(Integer userId) {
        return notificationRepository.findByUser_UserIdAndIsReadFalse(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification notification) {

        NotificationDTO dto = new NotificationDTO();

        dto.setNotificationId(notification.getNotificationId());
        dto.setUserId(notification.getUser().getUserId());
        dto.setUserName(notification.getUser().getFullName());
        dto.setMessage(notification.getMessage());
        dto.setNotificationType(notification.getNotificationType());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        return dto;
    }
}