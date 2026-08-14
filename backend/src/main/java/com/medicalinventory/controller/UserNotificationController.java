package com.medicalinventory.controller;

import com.medicalinventory.entity.UserNotification;
import com.medicalinventory.repository.UserNotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-notifications")
@CrossOrigin
public class UserNotificationController {

    private final UserNotificationRepository userNotificationRepository;

    public UserNotificationController(UserNotificationRepository userNotificationRepository) {
        this.userNotificationRepository = userNotificationRepository;
    }

    @GetMapping("/{userId}")
    public List<UserNotification> getUserNotifications(
            @PathVariable Long userId) {

        return userNotificationRepository.findByUser_Id(userId);
    }

    @PutMapping("/{id}/read")
    public UserNotification markAsRead(
            @PathVariable Long id) {

        UserNotification notification = userNotificationRepository.findById(id)
                .orElseThrow();

        notification.setIsRead(!notification.getIsRead());

        return userNotificationRepository.save(notification);
    }
}