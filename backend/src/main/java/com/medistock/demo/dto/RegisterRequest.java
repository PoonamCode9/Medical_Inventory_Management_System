package com.medistock.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String username;
    private String email;
    private String phone;      // <-- Add this

    private String password;
    private String fullName;

    // Role (ADMIN / STAFF / PHARMACIST)
    private String role;
}