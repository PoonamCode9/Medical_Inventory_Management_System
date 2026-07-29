package com.medistock.controller;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;
import com.medistock.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;   

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request){

        return authService.register(request);

    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {

    User user = authService.login(request);

    if (user == null) {
        return ResponseEntity.badRequest().body("Invalid Email or Password");
    }

    return ResponseEntity.ok(user);
}

}