package com.medistock.backend.service;

import com.medistock.backend.dto.ChangePasswordRequest;
import com.medistock.backend.dto.ProfileResponse;
import com.medistock.backend.dto.UpdateProfileRequest;

public interface ProfileService {

    // Get logged-in user's profile
    ProfileResponse getProfile(String email);

    // Update full name & phone
    ProfileResponse updateProfile(String email, UpdateProfileRequest request);

    // Change password
    void changePassword(String email, ChangePasswordRequest request);
}