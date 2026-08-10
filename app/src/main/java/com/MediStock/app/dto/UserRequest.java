package com.MediStock.app.dto;

public class UserRequest {

    private String name;
    private String email;
    private String password;
    private Long roleId;

    public UserRequest() {
    }

    public UserRequest(
            String name,
            String email,
            String password,
            Long roleId
    ) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.roleId = roleId;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

}