package com.medistock.backend.controller;

import com.medistock.backend.dto.request.LoginRequest;
import com.medistock.backend.dto.request.RegisterRequest;
import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.dto.response.JwtResponse;
import com.medistock.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterRequest registerRequest) {
        String result = authService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message(result)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.<JwtResponse>builder()
                .success(true)
                .message("Login successful")
                .data(jwtResponse)
                .build());
    }
}
