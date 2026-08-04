package com.MediStock.app.controllers;

import com.MediStock.app.dto.LoginResponse;
import com.MediStock.app.entities.User;
import com.MediStock.app.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {

        try {

            String email = loginData.get("email");
            String password = loginData.get("password");

            LoginResponse response =
                    authenticationService.loginUser(email, password);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {

        try {

            String successMessage =
                    authenticationService.registerUser(newUser);

            return ResponseEntity.ok(
                    Map.of("message", successMessage)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }
}