package com.medistock.demo.dto;

public class VerifyResetOtpRequest {

    private String email;

    private String otp;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public VerifyResetOtpRequest() {
    }


    // =====================================================
    // GET EMAIL
    // =====================================================

    public String getEmail() {
        return email;
    }


    // =====================================================
    // SET EMAIL
    // =====================================================

    public void setEmail(String email) {
        this.email = email;
    }


    // =====================================================
    // GET OTP
    // =====================================================

    public String getOtp() {
        return otp;
    }


    // =====================================================
    // SET OTP
    // =====================================================

    public void setOtp(String otp) {
        this.otp = otp;
    }
}