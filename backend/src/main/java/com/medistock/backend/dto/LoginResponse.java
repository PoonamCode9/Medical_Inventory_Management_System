package com.medistock.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private Integer roleId;
    private String roleName;
    private String fullName;

    // NEW — the frontend currently has no way to know which user is logged
    // in (only role/name), which blocks anything that needs to be scoped to
    // "this user" (their own notifications, who performed an action, etc.)
    private Integer userId;

}