package com.medistock.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GoogleLoginResponse {

    private String token;

    private String role;

    private String fullName;

    private String email;

}