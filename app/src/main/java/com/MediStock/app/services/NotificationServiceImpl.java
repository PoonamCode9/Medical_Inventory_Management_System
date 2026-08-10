package com.MediStock.app.services;

import com.MediStock.app.constants.NotificationConstants;
import com.MediStock.app.dto.NotificationResponse;
import com.MediStock.app.dto.ResolveNotificationRequest;
import com.MediStock.app.entities.Inventory;
import com.MediStock.app.entities.Notification;
import com.MediStock.app.entities.User;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
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

    private final ActivityLogService activityLogService;

    public NotificationServiceImpl(

            NotificationRepository notificationRepository,

            InventoryRepository inventoryRepository,

            UserRepository userRepository,

            EmailService emailService,

            ActivityLogService activityLogService

    ) {

        this.notificationRepository =
                notificationRepository;

        this.inventoryRepository =
                inventoryRepository;

        this.userRepository =
                userRepository;

        this.emailService =
                emailService;

        this.activityLogService =
                activityLogService;

    }

    /*
    |--------------------------------------------------------------------------
    | Get All Notifications
    |--------------------------------------------------------------------------
    */

    @Override
    public List<NotificationResponse> getAllNotifications() {

        return notificationRepository
                .findAllByOrderByCreatedDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    /*
    |--------------------------------------------------------------------------
    | Get Notification By ID
    |--------------------------------------------------------------------------
    */

    @Override
    public NotificationResponse getNotificationById(
            Long notificationId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found."
                                )
                        );

        return mapToResponse(notification);

    }

    /*
    |--------------------------------------------------------------------------
    | Get Notifications By Status
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Get Notifications By Alert Type
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Create Notification
    |--------------------------------------------------------------------------
    */

    @Override
    public Notification createNotification(
            Inventory inventory,
            AlertType alertType
    ) {

        /*
         * Do not create another notification if
         * an ACTIVE or REVIEWED notification already
         * exists for this inventory and alert type.
         */
        if (
                notificationExists(
                        inventory,
                        alertType
                )
        ) {

            return null;

        }

        Notification notification =
                new Notification();

        notification.setInventory(
                inventory
        );

        notification.setAlertType(
                alertType
        );

        notification.setStatus(
                NotificationStatus.ACTIVE
        );

        notification.setCreatedDate(
                LocalDateTime.now()
        );

        /*
         * Save the notification.
         */
        Notification savedNotification =
                notificationRepository.save(
                        notification
                );

        /*
         * IMPORTANT:
         *
         * Notifications are normally created automatically
         * during synchronization.
         *
         * We therefore do NOT create a user-attributed
         * ActivityLog here. Otherwise the admin who presses
         * "Run Check" would incorrectly appear as the person
         * who created the notification.
         */

        return savedNotification;

    }

    /*
    |--------------------------------------------------------------------------
    | Review Notification
    |--------------------------------------------------------------------------
    */

    @Override
    public NotificationResponse reviewNotification(
            Long notificationId,
            ResolveNotificationRequest request
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found."
                                )
                        );

        /*
         * A resolved notification cannot be reviewed.
         */
        if (
                notification.getStatus()
                        == NotificationStatus.RESOLVED
        ) {

            throw new RuntimeException(
                    "Resolved notifications cannot be reviewed."
            );

        }

        /*
         * Find the user who performed the review.
         */
        User user =
                userRepository
                        .findById(
                                request.getUserId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        /*
         * Update notification.
         */
        notification.setStatus(
                NotificationStatus.REVIEWED
        );

        notification.setReviewedBy(
                user
        );

        notification.setReviewedDate(
                LocalDateTime.now()
        );

        notification.setRemarks(
                request.getRemarks()
        );

        Notification saved =
                notificationRepository.save(
                        notification
                );

        /*
         * Record the human review action.
         */
        activityLogService.logActivity(

                ActivityModule.NOTIFICATION,

                ActivityAction.UPDATED,

                saved.getNotificationId(),

                buildNotificationReference(
                        saved
                ),

                "Reviewed "
                        + saved.getAlertType()
                        + " notification for medicine "
                        + saved.getInventory()
                                .getMedicine()
                                .getName()
                        + " (Batch: "
                        + saved.getInventory()
                                .getBatchNumber()
                        + ")"

        );

        return mapToResponse(saved);

    }

    /*
    |--------------------------------------------------------------------------
    | Delete Notification
    |--------------------------------------------------------------------------
    */

    @Override
    public void deleteNotification(
            Long notificationId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found."
                                )
                        );

        /*
         * Only resolved notifications can be
         * permanently deleted.
         */
        if (
                notification.getStatus()
                        != NotificationStatus.RESOLVED
        ) {

            throw new RuntimeException(
                    "Only resolved notifications can be deleted."
            );

        }

        /*
         * Capture the information before deleting
         * the database record.
         */
        String referenceName =
                buildNotificationReference(
                        notification
                );

        String medicineName =
                notification
                        .getInventory()
                        .getMedicine()
                        .getName();

        String batchNumber =
                notification
                        .getInventory()
                        .getBatchNumber();

        /*
         * Delete the notification.
         */
        notificationRepository.delete(
                notification
        );

        /*
         * Record the human deletion action.
         *
         * This happens AFTER the notification is deleted,
         * but the required identifying information was saved
         * above.
         */
        activityLogService.logActivity(

                ActivityModule.NOTIFICATION,

                ActivityAction.DELETED,

                notificationId,

                referenceName,

                "Deleted resolved "
                        + notification.getAlertType()
                        + " notification for medicine "
                        + medicineName
                        + " (Batch: "
                        + batchNumber
                        + ")"

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Check Whether Notification Exists
    |--------------------------------------------------------------------------
    */

    @Override
    public boolean notificationExists(
            Inventory inventory,
            AlertType alertType
    ) {

        /*
         * ACTIVE notification exists.
         */
        boolean activeExists =
                notificationRepository
                        .existsByInventoryAndAlertTypeAndStatus(
                                inventory,
                                alertType,
                                NotificationStatus.ACTIVE
                        );

        /*
         * REVIEWED notification exists.
         */
        boolean reviewedExists =
                notificationRepository
                        .existsByInventoryAndAlertTypeAndStatus(
                                inventory,
                                alertType,
                                NotificationStatus.REVIEWED
                        );

        return activeExists || reviewedExists;

    }

    /*
    |--------------------------------------------------------------------------
    | Synchronize Notifications
    |--------------------------------------------------------------------------
    */

    @Override
    public void synchronizeNotifications() {

        System.out.println();

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "SynchronizeNotifications() CALLED"
        );

        System.out.println(
                "=========================================="
        );

        LocalDate today =
                LocalDate.now();

        List<Notification> newNotifications =
                new ArrayList<>();

        List<Inventory> inventoryList =
                inventoryRepository.findAll();

        System.out.println(
                "Inventory records checked: "
                        + inventoryList.size()
        );

        /*
         * Check every inventory record against
         * every available alert type.
         */
        for (
                Inventory inventory :
                inventoryList
        ) {

            for (
                    AlertType alertType :
                    AlertType.values()
            ) {

                /*
                 * The issue still exists.
                 */
                if (
                        isIssuePresent(
                                inventory,
                                alertType,
                                today
                        )
                ) {

                    System.out.println(
                            "Issue detected: "
                                    + alertType
                                    + " | Medicine: "
                                    + inventory
                                            .getMedicine()
                                            .getName()
                                    + " | Batch: "
                                    + inventory
                                            .getBatchNumber()
                    );

                    Notification notification =
                            createNotification(
                                    inventory,
                                    alertType
                            );

                    /*
                     * A new notification was created.
                     */
                    if (
                            notification != null
                    ) {

                        System.out.println(
                                "NEW NOTIFICATION CREATED: "
                                        + notification
                                                .getNotificationId()
                        );

                        newNotifications.add(
                                notification
                        );

                    } else {

                        System.out.println(
                                "Notification already exists for: "
                                        + alertType
                                        + " | Batch: "
                                        + inventory
                                                .getBatchNumber()
                        );

                    }

                }

                /*
                 * The issue no longer exists.
                 *
                 * Automatically resolve any ACTIVE
                 * or REVIEWED notifications.
                 */
                else {

                    autoResolveOpenNotifications(
                            inventory,
                            alertType
                    );

                }

            }

        }

        System.out.println(
                "New notifications created: "
                        + newNotifications.size()
        );

        /*
         * Send email only when new notifications
         * were created.
         */
        if (
                !newNotifications.isEmpty()
        ) {

            System.out.println();

            System.out.println(
                    "Calling EmailService.sendInventoryAlert()..."
            );

            try {

                emailService.sendInventoryAlert(
                        newNotifications
                );

                System.out.println(
                        "EmailService.sendInventoryAlert() RETURNED"
                );

            } catch (
                    Exception exception
            ) {

                System.err.println();

                System.err.println(
                        "EMAIL SERVICE CALL FAILED"
                );

                exception.printStackTrace();

            }

        }

        else {

            System.out.println(
                    "No NEW notifications found."
            );

            System.out.println(
                    "Email service will NOT be called."
            );

        }

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Notification synchronization completed."
        );

        System.out.println(
                "=========================================="
        );

        System.out.println();

    }

    /*
    |--------------------------------------------------------------------------
    | Determine Whether An Issue Still Exists
    |--------------------------------------------------------------------------
    */

    private boolean isIssuePresent(
            Inventory inventory,
            AlertType alertType,
            LocalDate today
    ) {

        switch (alertType) {

            case LOW_STOCK:

                return inventory.getQuantity()
                        <= NotificationConstants
                                .LOW_STOCK_THRESHOLD;

            case EXPIRED:

                return inventory.getExpDate()
                        .isBefore(today);

            case EXPIRING_SOON:

                return !inventory.getExpDate()
                        .isBefore(today)

                        &&

                        !inventory.getExpDate()
                                .isAfter(
                                        today.plusDays(
                                                NotificationConstants
                                                        .EXPIRY_WARNING_DAYS
                                        )
                                );

            default:

                return false;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Automatically Resolve Notifications
    |--------------------------------------------------------------------------
    */

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
                        .filter(
                                notification ->

                                        notification
                                                .getStatus()
                                                == NotificationStatus.ACTIVE

                                        ||

                                        notification
                                                .getStatus()
                                                == NotificationStatus.REVIEWED
                        )
                        .collect(
                                Collectors.toList()
                        );

        /*
         * Resolve every ACTIVE or REVIEWED
         * notification whose issue no longer exists.
         */
        for (
                Notification notification :
                openNotifications
        ) {

            notification.setStatus(
                    NotificationStatus.RESOLVED
            );

            notification.setResolvedDate(
                    LocalDateTime.now()
            );

            /*
             * Do not overwrite existing review remarks.
             */
            if (
                    notification.getRemarks() == null

                            ||

                    notification.getRemarks()
                            .trim()
                            .isEmpty()
            ) {

                notification.setRemarks(
                        "Automatically resolved after inventory update."
                );

            }

        }

        /*
         * Save automatically resolved notifications.
         */
        if (
                !openNotifications.isEmpty()
        ) {

            notificationRepository.saveAll(
                    openNotifications
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Build Notification Reference
    |--------------------------------------------------------------------------
    */

    private String buildNotificationReference(
            Notification notification
    ) {

        return "Notification #"
                + notification.getNotificationId()
                + " - "
                + notification.getAlertType()
                + " - Batch "
                + notification
                        .getInventory()
                        .getBatchNumber();

    }

    /*
    |--------------------------------------------------------------------------
    | Map Entity To Response DTO
    |--------------------------------------------------------------------------
    */

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        NotificationResponse response =
                new NotificationResponse();

        Inventory inventory =
                notification.getInventory();

        response.setNotificationId(
                notification.getNotificationId()
        );

        response.setBatchId(
                inventory.getBatchId()
        );

        response.setBatchNumber(
                inventory.getBatchNumber()
        );

        response.setMedicineId(
                inventory
                        .getMedicine()
                        .getMedicineId()
        );

        response.setMedicineName(
                inventory
                        .getMedicine()
                        .getName()
        );

        response.setCategory(
                inventory
                        .getMedicine()
                        .getCategory()
        );

        response.setQuantity(
                inventory.getQuantity()
        );

        response.setMfgDate(
                inventory.getMfgDate()
        );

        response.setExpDate(
                inventory.getExpDate()
        );

        response.setAlertType(
                notification.getAlertType()
        );

        response.setStatus(
                notification.getStatus()
        );

        response.setCreatedDate(
                notification.getCreatedDate()
        );

        response.setReviewedDate(
                notification.getReviewedDate()
        );

        response.setResolvedDate(
                notification.getResolvedDate()
        );

        /*
         * Review remarks are returned to the frontend.
         */
        response.setRemarks(
                notification.getRemarks()
        );

        /*
         * Reviewer name.
         */
        if (
                notification.getReviewedBy() != null
        ) {

            response.setReviewedBy(
                    notification
                            .getReviewedBy()
                            .getName()
            );

        }

        /*
         * Resolver name.
         *
         * Automatic resolution does not assign a
         * resolvedBy user, so this remains null for
         * automatically resolved notifications.
         */
        if (
                notification.getResolvedBy() != null
        ) {

            response.setResolvedBy(
                    notification
                            .getResolvedBy()
                            .getName()
            );

        }

        /*
         * Calculate remaining days until expiry.
         */
        long daysRemaining =
                ChronoUnit.DAYS.between(
                        LocalDate.now(),
                        inventory.getExpDate()
                );

        response.setDaysRemaining(
                daysRemaining
        );

        return response;

    }

}