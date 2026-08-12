package com.medistock.demo.dto;

public class ForgotPasswordRequest {

    private String email;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public ForgotPasswordRequest() {
    }


    // =====================================================
    // GETTER
    // =====================================================

    public String getEmail() {
        return email;
    }


    // =====================================================
    // SETTER
    // =====================================================

    public void setEmail(String email) {
        this.email = email;
    }
}