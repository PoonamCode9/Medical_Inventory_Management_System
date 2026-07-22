package com.medical.om.om_backend.Dto;

import lombok.Getter;
import lombok.Setter;

// This DTO represents the LOGIN form the user submits.
// It is intentionally smaller than RegisterReq — we only ask for
// the minimum needed to verify identity: who are you + prove it.
@Getter
@Setter
public class LoginReq {

    // The username the user types on the login screen
    // Maps to "username" in JSON: { "username": "drsmith", ... }
    private String username;

    // The raw password the user types
    // We will compare this against the BCrypt hash stored in the DB
    // Maps to "password" in JSON: { ..., "password": "secret123" }
    private String password;
}
