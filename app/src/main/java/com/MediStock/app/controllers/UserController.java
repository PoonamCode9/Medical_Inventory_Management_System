package com.MediStock.app.controllers;

import com.MediStock.app.dto.UserRequest;
import com.MediStock.app.dto.UserResponse;
import com.MediStock.app.services.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {

        this.userService = userService;

    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();

    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUserById(
            @PathVariable Long userId
    ) {

        return userService.getUserById(userId);

    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(
            @RequestBody UserRequest request
    ) {

        return userService.createUser(request);

    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUser(
            @PathVariable Long userId,
            @RequestBody UserRequest request
    ) {

        return userService.updateUser(
                userId,
                request
        );

    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(
            @PathVariable Long userId
    ) {

        userService.deleteUser(userId);

    }

}