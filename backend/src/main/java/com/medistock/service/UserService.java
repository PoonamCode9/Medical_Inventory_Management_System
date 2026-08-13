package com.medistock.service;

import com.medistock.dto.ForgotPasswordRequest;
import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import com.medistock.dto.RegisterRequest;
import com.medistock.dto.ResetPasswordRequest;
import com.medistock.dto.ResetPasswordTokenRequest;
import com.medistock.dto.UpdateProfileRequest;
import com.medistock.entity.User;

public interface UserService {

    User register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    User getUserById(Long id);

    User getProfile(String email);

    User updateProfile(String email, UpdateProfileRequest request);

    void resetPassword(String email, ResetPasswordRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPasswordWithToken(ResetPasswordTokenRequest request);

    // OAuth2
    User findOrCreateGoogleUser(String name, String email);
}