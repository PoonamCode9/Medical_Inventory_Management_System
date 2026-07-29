package com.medistock.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Integer notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "title", length = 100)
    private String title;

    @Column(name = "message")
    private String message;

    @Column(name = "type", length = 30)
    private String type;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "priority", length = 30)
    private String priority;

    @Column(name = "related_module", length = 50)
    private String relatedModule;

    @Column(name = "related_entity_id")
    private Integer relatedEntityId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
