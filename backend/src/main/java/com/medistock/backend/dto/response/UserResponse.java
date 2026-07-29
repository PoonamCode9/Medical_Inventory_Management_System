package com.medistock.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Integer userId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status; // "Active" or "Inactive"
    private String lastLogin;
}
