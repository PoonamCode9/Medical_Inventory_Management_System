package com.medistock.service;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;
import com.medistock.dto.ResetPasswordRequest;

public interface UserService {

    User register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    User getUserById(Long id);

    User getProfile(String email);

User updateProfile(String email, com.medistock.dto.UpdateProfileRequest request);
void resetPassword(String email, ResetPasswordRequest request);

}