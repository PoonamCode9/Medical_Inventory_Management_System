package com.medistock.demo.dto;


import lombok.Data;


@Data
public class CreateUserRequest {


    private String fullName;


    private String username;


    private String email;


    private String phone;


    private String password;


    // ADMIN / PHARMACIST / STAFF
    private String role;


}