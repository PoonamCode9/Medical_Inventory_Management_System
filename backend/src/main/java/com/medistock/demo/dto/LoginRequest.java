package com.medistock.demo.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;

    private String password;

    private String role;

    // Used for ADMIN, PHARMACIST and STAFF
    private String secretCode;

}