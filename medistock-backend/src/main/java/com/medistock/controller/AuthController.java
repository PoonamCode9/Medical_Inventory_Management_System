package com.medistock.controller;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;
import com.medistock.service.AuthService;
import com.medistock.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        String result = authService.register(request);

        if (result.equals("Email already registered")) {

            return ResponseEntity
                    .badRequest()
                    .body(result);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        User user = authService.login(request);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid Email or Password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        Map<String, Object> response = new HashMap<>();

        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("name", user.getName());

        return ResponseEntity.ok(response);
    }
}