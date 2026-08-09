package com.medistock.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.backend.dto.ChangePasswordRequest;
import com.medistock.backend.dto.ProfileResponse;
import com.medistock.backend.dto.UpdateProfileRequest;
import com.medistock.backend.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // ===========================
    // Get Logged-in User Profile
    // ===========================
    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                profileService.getProfile(email)
        );
    }

    // ===========================
    // Update Profile
    // ===========================
    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @Validated @RequestBody UpdateProfileRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                profileService.updateProfile(email, request)
        );
    }

    // ===========================
    // Change Password
    // ===========================
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Validated @RequestBody ChangePasswordRequest request) {

        String email = authentication.getName();

        profileService.changePassword(email, request);

        return ResponseEntity.ok("Password changed successfully.");
    }

}