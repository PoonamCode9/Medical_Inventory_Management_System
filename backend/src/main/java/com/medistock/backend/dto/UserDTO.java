package com.medistock.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    private Integer userId;

    private String fullName;

    private String email;

    private String phone;

    private Integer roleId;

    private String roleName;

    private LocalDateTime createdAt;
}