package com.MediStock.app.dto;

public class UserResponse {

    private Long userId;

    private String name;

    private String email;

    private Long roleId;

    private String roleName;

    public UserResponse() {

    }

    public UserResponse(
            Long userId,
            String name,
            String email,
            Long roleId,
            String roleName
    ) {

        this.userId = userId;
        this.name = name;
        this.email = email;
        this.roleId = roleId;
        this.roleName = roleName;

    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

}