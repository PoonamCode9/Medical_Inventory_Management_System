package com.MediStock.app.controllers;

import com.MediStock.app.dto.NotificationResponse;
import com.MediStock.app.dto.ResolveNotificationRequest;
import com.MediStock.app.enums.AlertType;
import com.MediStock.app.enums.NotificationStatus;
import com.MediStock.app.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    /*
    |--------------------------------------------------------------------------
    | Get All Notifications
    |--------------------------------------------------------------------------
    */

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN','PHARMACIST','STAFF')"
    )
    public ResponseEntity<List<NotificationResponse>>
    getAllNotifications() {

        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Get Notification By ID
    |--------------------------------------------------------------------------
    */

    @GetMapping("/{notificationId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN','PHARMACIST','STAFF')"
    )
    public ResponseEntity<NotificationResponse>
    getNotificationById(
            @PathVariable Long notificationId
    ) {

        return ResponseEntity.ok(
                notificationService.getNotificationById(
                        notificationId
                )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Filter By Status
    |--------------------------------------------------------------------------
    */

    @GetMapping("/status/{status}")
    @PreAuthorize(
            "hasAnyRole('ADMIN','PHARMACIST','STAFF')"
    )
    public ResponseEntity<List<NotificationResponse>>
    getNotificationsByStatus(
            @PathVariable String status
    ) {

        NotificationStatus notificationStatus;

        try {

            notificationStatus =
                    NotificationStatus.valueOf(
                            status.toUpperCase()
                    );

        } catch (IllegalArgumentException ex) {

            throw new RuntimeException(
                    "Invalid Notification Status."
            );
        }

        return ResponseEntity.ok(
                notificationService.getNotificationsByStatus(
                        notificationStatus
                )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Filter By Alert Type
    |--------------------------------------------------------------------------
    */

    @GetMapping("/alert/{alertType}")
    @PreAuthorize(
            "hasAnyRole('ADMIN','PHARMACIST','STAFF')"
    )
    public ResponseEntity<List<NotificationResponse>>
    getNotificationsByAlertType(
            @PathVariable String alertType
    ) {

        AlertType type;

        try {

            type =
                    AlertType.valueOf(
                            alertType.toUpperCase()
                    );

        } catch (IllegalArgumentException ex) {

            throw new RuntimeException(
                    "Invalid Alert Type."
            );
        }

        return ResponseEntity.ok(
                notificationService.getNotificationsByAlertType(
                        type
                )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Review Notification
    |--------------------------------------------------------------------------
    */

    @PutMapping("/{notificationId}/review")
    @PreAuthorize(
            "hasAnyRole('ADMIN','PHARMACIST')"
    )
    public ResponseEntity<NotificationResponse>
    reviewNotification(

            @PathVariable Long notificationId,

            @RequestBody ResolveNotificationRequest request

    ) {

        return ResponseEntity.ok(
                notificationService.reviewNotification(
                        notificationId,
                        request
                )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Notification
    |--------------------------------------------------------------------------
    */

    @DeleteMapping("/{notificationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>
    deleteNotification(
            @PathVariable Long notificationId
    ) {

        notificationService.deleteNotification(
                notificationId
        );

        return ResponseEntity.ok(
                "Notification deleted successfully."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Run Notification Check Manually
    |--------------------------------------------------------------------------
    */

    @PostMapping("/check")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>
    runNotificationCheck() {

        notificationService.synchronizeNotifications();

        return ResponseEntity.ok(
                "Notification check completed successfully."
        );
    }
}