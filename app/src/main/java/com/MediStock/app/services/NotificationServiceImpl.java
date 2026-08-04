package com.MediStock.app.services;

import com.MediStock.app.constants.NotificationConstants;
import com.MediStock.app.dto.NotificationResponse;
import com.MediStock.app.dto.ResolveNotificationRequest;
import com.MediStock.app.entities.Inventory;
import com.MediStock.app.entities.Notification;
import com.MediStock.app.entities.User;
import com.MediStock.app.enums.AlertType;
import com.MediStock.app.enums.NotificationStatus;
import com.MediStock.app.repositories.InventoryRepository;
import com.MediStock.app.repositories.NotificationRepository;
import com.MediStock.app.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            InventoryRepository inventoryRepository,
            UserRepository userRepository,
            EmailService emailService
    ) {
        this.notificationRepository = notificationRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Override
    public List<NotificationResponse> getAllNotifications() {

        return notificationRepository
                .findAllByOrderByCreatedDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public NotificationResponse getNotificationById(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found."));

        return mapToResponse(notification);

    }

    @Override
    public List<NotificationResponse> getNotificationsByStatus(
            NotificationStatus status
    ) {

        return notificationRepository
                .findByStatusOrderByCreatedDateDesc(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public List<NotificationResponse> getNotificationsByAlertType(
            AlertType alertType
    ) {

        return notificationRepository
                .findByAlertTypeOrderByCreatedDateDesc(alertType)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public Notification createNotification(
            Inventory inventory,
            AlertType alertType
    ) {

        if (notificationExists(inventory, alertType)) {
            return null;
        }

        Notification notification = new Notification();

        notification.setInventory(inventory);
        notification.setAlertType(alertType);
        notification.setStatus(NotificationStatus.ACTIVE);
        notification.setCreatedDate(LocalDateTime.now());

        return notificationRepository.save(notification);

    }

    @Override
    public NotificationResponse reviewNotification(
            Long notificationId,
            ResolveNotificationRequest request
    ) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found."));

        if (notification.getStatus() == NotificationStatus.RESOLVED) {
            throw new RuntimeException(
                    "Resolved notifications cannot be reviewed."
            );
        }

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        notification.setStatus(NotificationStatus.REVIEWED);
        notification.setReviewedBy(user);
        notification.setReviewedDate(LocalDateTime.now());
        notification.setRemarks(request.getRemarks());

        Notification saved =
                notificationRepository.save(notification);

        return mapToResponse(saved);

    }

    @Override
    public NotificationResponse resolveNotification(
            Long notificationId,
            ResolveNotificationRequest request
    ) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found."));

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        notification.setStatus(NotificationStatus.RESOLVED);
        notification.setResolvedBy(user);
        notification.setResolvedDate(LocalDateTime.now());
        notification.setRemarks(request.getRemarks());

        Notification saved =
                notificationRepository.save(notification);

        return mapToResponse(saved);

    }

    @Override
    public boolean notificationExists(
            Inventory inventory,
            AlertType alertType
    ) {

        return notificationRepository
                .existsByInventoryAndAlertTypeAndStatus(
                        inventory,
                        alertType,
                        NotificationStatus.ACTIVE
                )
                ||
                notificationRepository
                        .existsByInventoryAndAlertTypeAndStatus(
                                inventory,
                                alertType,
                                NotificationStatus.REVIEWED
                        );

    }

    @Override
    public void synchronizeNotifications() {

        LocalDate today = LocalDate.now();

        List<Notification> newNotifications =
                new ArrayList<>();

        for (Inventory inventory : inventoryRepository.findAll()) {

            for (AlertType alertType : AlertType.values()) {

                if (isIssuePresent(inventory, alertType, today)) {

                    Notification notification =
                            createNotification(inventory, alertType);

                    if (notification != null) {
                        newNotifications.add(notification);
                    }

                } else {

                    autoResolveOpenNotifications(
                            inventory,
                            alertType
                    );

                }

            }

        }

        if (!newNotifications.isEmpty()) {
            emailService.sendInventoryAlert(newNotifications);
        }

    }

    private boolean isIssuePresent(
            Inventory inventory,
            AlertType alertType,
            LocalDate today
    ) {

        switch (alertType) {

            case LOW_STOCK:
                return inventory.getQuantity()
                        <= NotificationConstants.LOW_STOCK_THRESHOLD;

            case EXPIRED:
                return inventory.getExpDate().isBefore(today);

            case EXPIRING_SOON:
                return !inventory.getExpDate().isBefore(today)
                        &&
                        !inventory.getExpDate().isAfter(
                                today.plusDays(
                                        NotificationConstants.EXPIRY_WARNING_DAYS
                                )
                        );

            default:
                return false;

        }

    }

    private void autoResolveOpenNotifications(
            Inventory inventory,
            AlertType alertType
    ) {

        List<Notification> openNotifications =
                notificationRepository
                        .findByInventoryAndAlertType(
                                inventory,
                                alertType
                        )
                        .stream()
                        .filter(notification ->
                                notification.getStatus()
                                        == NotificationStatus.ACTIVE
                                ||
                                notification.getStatus()
                                        == NotificationStatus.REVIEWED
                        )
                        .collect(Collectors.toList());

        for (Notification notification : openNotifications) {

            notification.setStatus(NotificationStatus.RESOLVED);
            notification.setResolvedDate(LocalDateTime.now());

            if (
                    notification.getRemarks() == null
                    ||
                    notification.getRemarks().trim().isEmpty()
            ) {
                notification.setRemarks(
                        "Automatically resolved after inventory update."
                );
            }

        }

        notificationRepository.saveAll(openNotifications);

    }

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        NotificationResponse response =
                new NotificationResponse();

        Inventory inventory = notification.getInventory();

        response.setNotificationId(notification.getNotificationId());
        response.setBatchId(inventory.getBatchId());
        response.setBatchNumber(inventory.getBatchNumber());

        response.setMedicineId(
                inventory.getMedicine().getMedicineId()
        );

        response.setMedicineName(
                inventory.getMedicine().getName()
        );

        response.setCategory(
                inventory.getMedicine().getCategory()
        );

        response.setQuantity(inventory.getQuantity());
        response.setMfgDate(inventory.getMfgDate());
        response.setExpDate(inventory.getExpDate());

        response.setAlertType(notification.getAlertType());
        response.setStatus(notification.getStatus());

        response.setCreatedDate(notification.getCreatedDate());
        response.setReviewedDate(notification.getReviewedDate());
        response.setResolvedDate(notification.getResolvedDate());
        response.setRemarks(notification.getRemarks());

        if (notification.getReviewedBy() != null) {

            response.setReviewedBy(
                    notification.getReviewedBy().getName()
            );

        }

        if (notification.getResolvedBy() != null) {

            response.setResolvedBy(
                    notification.getResolvedBy().getName()
            );

        }

        long daysRemaining =
                ChronoUnit.DAYS.between(
                        LocalDate.now(),
                        inventory.getExpDate()
                );

        response.setDaysRemaining(daysRemaining);

        return response;

    }

}
