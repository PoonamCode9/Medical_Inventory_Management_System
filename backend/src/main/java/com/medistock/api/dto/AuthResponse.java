package com.medistock.api.dto;

import com.medistock.api.models.UserRole;

public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private UserRole role;

    public AuthResponse(String token, String username, String email, UserRole role) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
