package com.medistock.backend.controller;

import com.medistock.backend.dto.request.UserRequest;
import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.dto.response.UserResponse;
import com.medistock.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        log.info("Received request to fetch all user registry records");
        List<UserResponse> list = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .success(true)
                .message("Fetched user records successfully.")
                .data(list)
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserRequest userRequest) {
        log.info("Received request to provision new user: {}", userRequest.getEmail());
        UserResponse response = userService.createUser(userRequest);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User created successfully.")
                .data(response)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserRequest userRequest) {
        log.info("Received request to update details for user ID: {}", id);
        UserResponse response = userService.updateUser(id, userRequest);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User updated successfully.")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Integer id) {
        log.info("Received request to delete user ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("User deleted successfully.")
                .data("User index removed.")
                .build());
    }
}
