package com.medistock.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medistock.backend.dto.GoogleLoginRequest;
import com.medistock.backend.dto.GoogleLoginResponse;
import com.medistock.backend.service.GoogleAuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;

    public GoogleAuthController(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(
            @RequestBody GoogleLoginRequest request) {

        try {

            GoogleLoginResponse response =
                    googleAuthService.login(request.getToken());

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }

}