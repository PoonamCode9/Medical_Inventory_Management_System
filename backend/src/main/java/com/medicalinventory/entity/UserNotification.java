package com.medicalinventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_notifications")
@Data
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "is_read")
    private Boolean isRead = false;
}