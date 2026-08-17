package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.model.Notification;
import com.example.medistock.medistock.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Map<String, Object> payload) {
        try {
            Notification notif = new Notification();
            notif.setType((String) payload.getOrDefault("type", payload.getOrDefault("notificationType", "INFO")));
            notif.setTitle((String) payload.getOrDefault("title", "Notification"));
            notif.setMessage((String) payload.getOrDefault("message", ""));
            notif.setPriority((String) payload.getOrDefault("priority", "info"));
            notif.setRead(false);
            notif.setCreatedAt(LocalDateTime.now());

            Notification saved = notificationRepository.save(notif);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to create notification: " + e.getMessage());
        }
    }

    @RequestMapping(value = "/{id}/read", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setRead(true);
            notificationRepository.save(notif);
            return ResponseEntity.ok(notif);
        }).orElse(ResponseEntity.notFound().build());
    }

    @RequestMapping(value = "/read-all", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<?> markAllAsRead() {
        List<Notification> all = notificationRepository.findAll();
        all.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(all);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return ResponseEntity.ok("Notification deleted");
        }
        return ResponseEntity.notFound().build();
    }
}