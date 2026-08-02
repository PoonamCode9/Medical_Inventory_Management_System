package com.medicalinventory.controller;

import com.medicalinventory.dto.ChangePasswordRequest;
import com.medicalinventory.entity.User;
import com.medicalinventory.security.JwtService;
import com.medicalinventory.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    // ==============================
    // GET TOTAL NUMBER OF USERS
    // ==============================

    @GetMapping("/count")
    public Long getUserCount() {

        return userService.getUserCount();

    }

    // ==============================
    // GET ALL USERS
    // ==============================

    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();

    }

    // ==============================
    // EDIT PROFILE
    // ==============================

    @PutMapping("/{id}")
    public Map<String, Object> updateUser(

            @PathVariable Long id,

            @RequestBody User user) {

        // Update user in database
        User updatedUser = userService.updateUser(id, user);

        // Generate new JWT using
        // the updated username
        String newToken = jwtService.generateToken(
                updatedUser.getUsername());

        // Create response
        Map<String, Object> response = new HashMap<>();

        response.put(
                "token",
                newToken);

        response.put(
                "userId",
                updatedUser.getId());

        response.put(
                "fullName",
                updatedUser.getFullName());

        response.put(
                "username",
                updatedUser.getUsername());

        response.put(
                "email",
                updatedUser.getEmail());

        response.put(
                "role",
                updatedUser.getRole().getName());

        return response;

    }

    // ==============================
    // CHANGE PASSWORD
    // ==============================

    @PutMapping("/{id}/change-password")
    public String changePassword(

            @PathVariable Long id,

            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(

                id,

                request.getCurrentPassword(),

                request.getNewPassword()

        );

        return "Password changed successfully";

    }

}