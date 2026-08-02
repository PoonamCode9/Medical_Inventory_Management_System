package com.medistock.demo.dto;


import lombok.Data;


@Data
public class UpdateProfileRequest {


    private String fullName;


    private String email;


    private String phone;


}