package com.medicalinventory.dto;

public class JwtResponse {

    private Long userId;
    private String token;
    private String type = "Bearer";
    private String role;
    private String fullName;
    private String username;
    private String email;

    public JwtResponse() {
    }

    public JwtResponse(Long userId, String token, String role, String fullName, String username, String email) {
        this.userId = userId;
        this.token = token;
        this.role = role;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}