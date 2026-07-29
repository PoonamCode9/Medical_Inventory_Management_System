package com.medistock.backend.service.impl;

import com.medistock.backend.entity.Notification;
import com.medistock.backend.entity.User;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.EmailNotificationService;
import com.medistock.backend.service.NotificationService;
import com.medistock.backend.service.PushNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailNotificationService emailNotificationService;
    private final PushNotificationService pushNotificationService;

    // Helper: dynamic role-aware notification filtering
    private List<Notification> filterByRole(List<Notification> list, User user) {
        if (user == null || user.getRole() == null) {
            // Read-only / viewer default filtering: only INFO / SUCCESS notifications
            return list.stream()
                    .filter(n -> "INFO".equalsIgnoreCase(n.getType()) || "SUCCESS".equalsIgnoreCase(n.getType()))
                    .collect(Collectors.toList());
        }

        String role = user.getRole().getRoleName();
        if ("ADMIN".equalsIgnoreCase(role)) {
            // Admins see everything
            return list;
        } else if ("PHARMACIST".equalsIgnoreCase(role)) {
            // Pharmacists see Medicine, Inventory, PO, Low Stock, Expiry (Filter out admin-only settings/system logs)
            return list.stream()
                    .filter(n -> !"SYSTEM".equalsIgnoreCase(n.getType()) && !"ERROR".equalsIgnoreCase(n.getType()))
                    .collect(Collectors.toList());
        } else {
            // Viewers see read-only INFO / SUCCESS notifications
            return list.stream()
                    .filter(n -> "INFO".equalsIgnoreCase(n.getType()) || "SUCCESS".equalsIgnoreCase(n.getType()))
                    .collect(Collectors.toList());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForUser(String email) {
        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }
        List<Notification> all = notificationRepository.findByUserOrUserIsNullOrderByCreatedAtDesc(user);
        return filterByRole(all, user);
    }

    @Override
    @Transactional
    public Notification createNotification(String email, String title, String message, String type, String priority, String relatedModule, Integer relatedEntityId) {
        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        String actualPriority = (priority != null) ? priority.toUpperCase() : "MEDIUM";
        String actualType = (type != null) ? type.toUpperCase() : "INFO";

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(actualType)
                .priority(actualPriority)
                .relatedModule(relatedModule)
                .relatedEntityId(relatedEntityId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        Notification saved = notificationRepository.save(notification);

        // Dispatch push notification
        pushNotificationService.sendPushNotification(saved);

        // Send Email Alert on Important Notifications (LOW_STOCK, OUT_OF_STOCK, EXPIRY_ALERT, EXPIRED, PURCHASE_DELIVERED, or HIGH priority, or MEDICINE actions)
        boolean isImportant = "LOW_STOCK".equals(actualType) 
                || "OUT_OF_STOCK".equals(actualType) 
                || "EXPIRY_ALERT".equals(actualType) 
                || "EXPIRED".equals(actualType)
                || "PURCHASE_DELIVERED".equals(actualType) 
                || "HIGH".equals(actualPriority)
                || "MEDICINE".equalsIgnoreCase(relatedModule);

        if (isImportant) {
            // Email all Admins and Pharmacists on important alerts and catalog actions in a background thread to prevent blocking
            List<User> recipients = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && 
                            ("ADMIN".equalsIgnoreCase(u.getRole().getRoleName()) || 
                             "PHARMACIST".equalsIgnoreCase(u.getRole().getRoleName())))
                    .collect(Collectors.toList());
            
            java.util.concurrent.CompletableFuture.runAsync(() -> {
                for (User recipient : recipients) {
                    try {
                        emailNotificationService.sendEmailNotification(recipient.getEmail(), saved);
                    } catch (Exception ex) {
                        log.error("Failed to dispatch asynchronous email notification to " + recipient.getEmail(), ex);
                    }
                }
            });
        }

        return saved;
    }

    @Override
    @Transactional
    public void markAsRead(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String email) {
        List<Notification> list = getNotificationsForUser(email);
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }

    @Override
    @Transactional
    public void deleteNotification(Integer id) {
        notificationRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotificationsForUser(String email) {
        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }
        List<Notification> allUnread = notificationRepository.findUnreadForUser(user);
        return filterByRole(allUnread, user);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCountForUser(String email) {
        return getUnreadNotificationsForUser(email).size();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> filterNotifications(String email, String type, Boolean isRead) {
        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }
        String filterType = (type != null && !"ALL".equalsIgnoreCase(type)) ? type.toUpperCase() : null;
        List<Notification> filtered = notificationRepository.filterNotifications(user, filterType, isRead);
        return filterByRole(filtered, user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> searchNotifications(String email, String query) {
        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }
        List<Notification> searched = notificationRepository.searchNotifications(user, query);
        return filterByRole(searched, user);
    }

    @Override
    @Transactional
    public void clearReadNotifications(String email) {
        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }
        if (user != null) {
            notificationRepository.deleteByIsReadTrueAndUser(user);
        } else {
            notificationRepository.deleteByIsReadTrueAndUserIsNull();
        }
    }
}
