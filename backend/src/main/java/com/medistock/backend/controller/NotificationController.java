package com.medistock.backend.controller;

import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.entity.Notification;
import com.medistock.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        List<Notification> list = notificationService.getNotificationsForUser(email);
        return ResponseEntity.ok(ApiResponse.<List<Notification>>builder()
                .success(true)
                .message("Fetched notifications.")
                .data(list)
                .build());
    }

    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        List<Notification> list = notificationService.getUnreadNotificationsForUser(email);
        return ResponseEntity.ok(ApiResponse.<List<Notification>>builder()
                .success(true)
                .message("Fetched unread notifications.")
                .data(list)
                .build());
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        long count = notificationService.getUnreadCountForUser(email);
        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .success(true)
                .message("Fetched unread notifications count.")
                .data(count)
                .build());
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Notification marked as read.")
                .data("SUCCESS")
                .build());
    }

    @PutMapping("/read-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("All notifications marked as read.")
                .data("SUCCESS")
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Integer id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Notification deleted successfully.")
                .data("SUCCESS")
                .build());
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<Notification>>> filterNotifications(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean isRead,
            Principal principal) {
        String email = principal != null ? principal.getName() : null;
        List<Notification> list = notificationService.filterNotifications(email, type, isRead);
        return ResponseEntity.ok(ApiResponse.<List<Notification>>builder()
                .success(true)
                .message("Filtered notifications.")
                .data(list)
                .build());
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<Notification>>> searchNotifications(
            @RequestParam String query,
            Principal principal) {
        String email = principal != null ? principal.getName() : null;
        List<Notification> list = notificationService.searchNotifications(email, query);
        return ResponseEntity.ok(ApiResponse.<List<Notification>>builder()
                .success(true)
                .message("Searched notifications.")
                .data(list)
                .build());
    }

    @DeleteMapping("/clear-read")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<String>> clearReadNotifications(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        notificationService.clearReadNotifications(email);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Cleared read notifications successfully.")
                .data("SUCCESS")
                .build());
    }
}
