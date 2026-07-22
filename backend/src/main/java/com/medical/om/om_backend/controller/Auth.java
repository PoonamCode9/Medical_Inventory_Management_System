package com.medical.om.om_backend.controller;

import com.medical.om.om_backend.Dto.AuthReq;
import com.medical.om.om_backend.Dto.LoginReq;
import com.medical.om.om_backend.Dto.RegisterReq;
import com.medical.om.om_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller exposing rest endpoints for registration and login operations under "/api/auth".
 */
@RestController
@RequestMapping("/api/auth")
public class Auth {

    private final AuthService authService;

    public Auth(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint for user registration.
     * Expects a JSON payload matching RegisterReq.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterReq request) {
        try {
            authService.register(request);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    /**
     * Endpoint for user login.
     * Expects a JSON payload matching LoginReq.
     * Returns a JWT token on success.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq request) {
        try {
            AuthReq response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(java.util.Collections.singletonMap("error", "Invalid username or password"));
        }
    }
}
