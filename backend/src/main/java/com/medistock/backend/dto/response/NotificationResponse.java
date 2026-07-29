package com.medistock.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Integer notificationId;
    private Integer userId;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private String createdAt;
}
