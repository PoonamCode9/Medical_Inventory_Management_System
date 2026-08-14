package com.medicalinventory.controller;

import com.medicalinventory.entity.UserNotification;
import com.medicalinventory.repository.UserNotificationRepository;
import com.medicalinventory.entity.User;
import com.medicalinventory.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
public class NotificationController {

    private final UserNotificationRepository userNotificationRepository;
    private final UserRepository userRepository;

    public NotificationController(
            UserNotificationRepository userNotificationRepository,
            UserRepository userRepository) {

        this.userNotificationRepository = userNotificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserNotification> getUserNotifications() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userNotificationRepository
                .findByUser_Id(user.getId());
    }

    @PutMapping("/{id}/read")
    public UserNotification markAsRead(
            @PathVariable Long id) {

        UserNotification userNotification = userNotificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        userNotification.setIsRead(true);

        return userNotificationRepository.save(userNotification);
    }
}