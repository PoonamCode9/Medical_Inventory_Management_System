package com.medistock.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private Integer userId;

    private String fullName;

    private String email;

    private String phone;

    private String role;

    private String createdAt;
}