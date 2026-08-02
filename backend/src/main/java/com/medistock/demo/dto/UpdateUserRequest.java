package com.medistock.demo.dto;


import lombok.Data;


@Data
public class UpdateUserRequest {


    private String fullName;


    private String username;


    private String email;


    private String phone;


    private String password;


    private String role;


}