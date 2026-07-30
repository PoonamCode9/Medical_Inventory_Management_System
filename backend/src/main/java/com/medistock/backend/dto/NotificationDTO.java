package com.medistock.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDTO {

    private Integer notificationId;

    private Integer userId;

    private String userName;

    private String message;

    private String notificationType;

    private Boolean isRead;

    private LocalDateTime createdAt;

}