package com.medistock.api.controllers;

import com.medistock.api.dto.AuthResponse;
import com.medistock.api.dto.LoginRequest;
import com.medistock.api.dto.RegisterRequest;
import com.medistock.api.models.User;
import com.medistock.api.models.UserRole;
import com.medistock.api.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request,
                                      Authentication authentication) {
        try {
            // PHARMACIST can only create STAFF accounts
            boolean isPharmacist = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_PHARMACIST"));
            if (isPharmacist && request.getRole() != UserRole.STAFF) {
                return ResponseEntity.status(403)
                        .body("Pharmacists can only register Staff accounts.");
            }
            User registeredUser = userService.register(request);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }
}
