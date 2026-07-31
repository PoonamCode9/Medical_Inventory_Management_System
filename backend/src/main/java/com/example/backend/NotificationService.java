package com.example.backend;

import com.example.backend.dto.NotificationDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                                UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NotificationDto createNotification(Integer userId, String type, String title,
                                               String message, String referenceType, Long referenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Notification notification = new Notification(user, type, title, message, referenceType, referenceId);
        Notification saved = notificationRepository.save(notification);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getRecentNotifications(Integer userId, int limit) {
        List<Notification> notifications;
        if (limit <= 0) limit = 5;
        notifications = notificationRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getAllNotifications(Integer userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId, Integer userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Integer userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Integer userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    private NotificationDto toDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setType(n.getType());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setReferenceType(n.getReferenceType());
        dto.setReferenceId(n.getReferenceId());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}

