package com.medicalinventory.backend.dto;

public class ResetPasswordRequestDTO {
    private String otp;
    private String newPassword;

    public ResetPasswordRequestDTO() {
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}