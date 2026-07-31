package com.medistock.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;
import com.medistock.service.UserService;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }
    @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request) {
    return userService.login(request);
}
@GetMapping("/profile/{id}")
public User getProfile(@PathVariable Long id) {

    return userService.getUserById(id);

}

}