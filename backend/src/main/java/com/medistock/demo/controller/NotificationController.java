package com.medistock.demo.controller;


import com.medistock.demo.entity.Notification;
import com.medistock.demo.service.NotificationService;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {


    private final NotificationService notificationService;


    public NotificationController(
            NotificationService notificationService
    ){

        this.notificationService = notificationService;

    }


    // =====================================
    // GET ALL NOTIFICATIONS
    // =====================================

    @GetMapping
    public ResponseEntity<List<Notification>> getAll(){

        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );

    }


    // =====================================
    // GET UNREAD NOTIFICATIONS
    // =====================================

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnread(){

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications()
        );

    }


    // =====================================
    // UNREAD COUNT
    // =====================================

    @GetMapping("/count")
    public ResponseEntity<Long> unreadCount(){

        return ResponseEntity.ok(
                notificationService.getUnreadCount()
        );

    }


    // =====================================
    // PHARMACIST NOTIFICATIONS
    // =====================================

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Notification>> getRoleNotifications(

            @PathVariable String role

    ){

        return ResponseEntity.ok(

                notificationService
                        .getRoleNotifications(
                                role.toUpperCase()
                        )

        );

    }


    // =====================================
    // PHARMACIST UNREAD
    // =====================================

    @GetMapping("/role/{role}/unread")
    public ResponseEntity<List<Notification>> getRoleUnread(

            @PathVariable String role

    ){

        return ResponseEntity.ok(

                notificationService
                        .getUnreadRoleNotifications(
                                role.toUpperCase()
                        )

        );

    }


    // =====================================
    // PHARMACIST UNREAD COUNT
    // =====================================

    @GetMapping("/role/{role}/count")
    public ResponseEntity<Long> getRoleUnreadCount(

            @PathVariable String role

    ){

        return ResponseEntity.ok(

                notificationService
                        .getUnreadRoleCount(
                                role.toUpperCase()
                        )

        );

    }


    // =====================================
    // CREATE NOTIFICATION
    // =====================================

    @PostMapping
    public ResponseEntity<?> create(

            @RequestBody Notification notification

    ){

        Notification saved =

                notificationService.createNotification(

                        notification.getTitle(),

                        notification.getMessage(),

                        notification.getNotificationType(),

                        notification.getReceiverRole()

                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);

    }


    // =====================================
    // CREATE STOCK ALERT
    // =====================================

    @PostMapping("/stock-alert")
    public ResponseEntity<?> stockAlert(

            @RequestParam String medicineName,

            @RequestParam int quantity

    ){

        Notification saved =

                notificationService.createStockAlert(

                        medicineName,

                        quantity

                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);

    }


    // =====================================
    // CREATE EXPIRY ALERT
    // =====================================

    @PostMapping("/expiry-alert")
    public ResponseEntity<?> expiryAlert(

            @RequestParam String medicineName,

            @RequestParam long days

    ){

        Notification saved =

                notificationService.createExpiryAlert(

                        medicineName,

                        days

                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);

    }


    // =====================================
    // GET BY TYPE
    // =====================================

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Notification>> getByType(

            @PathVariable String type

    ){

        return ResponseEntity.ok(

                notificationService.getByType(type)

        );

    }


    // =====================================
    // USER NOTIFICATIONS
    // =====================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(

            @PathVariable Long userId

    ){

        return ResponseEntity.ok(

                notificationService.getUserNotifications(
                        userId
                )

        );

    }


    // =====================================
    // MARK READ
    // =====================================

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markRead(

            @PathVariable Long id

    ){

        return ResponseEntity.ok(

                notificationService.markAsRead(id)

        );

    }


    // =====================================
    // MARK ALL READ
    // =====================================

    @PutMapping("/read-all")
    public ResponseEntity<String> markAllRead(){

        notificationService.markAllAsRead();

        return ResponseEntity.ok(
                "All notifications marked as read"
        );

    }


    // =====================================
    // DELETE ONE
    // =====================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(

            @PathVariable Long id

    ){

        notificationService.deleteNotification(id);

        return ResponseEntity.ok(
                "Notification deleted successfully"
        );

    }


    // =====================================
    // DELETE BY TYPE
    // =====================================

    @DeleteMapping("/type/{type}")
    public ResponseEntity<String> deleteByType(

            @PathVariable String type

    ){

        notificationService.deleteByType(type);

        return ResponseEntity.ok(
                type + " notifications deleted."
        );

    }

}