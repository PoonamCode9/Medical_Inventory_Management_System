package com.medistock.backend.controller;

import com.medistock.backend.model.User;
import com.medistock.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "${app.frontend.url}"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(
            userRepository.findAll()
        );
    }

    // Add new user
    @PostMapping
    public ResponseEntity<User> addUser(
            @RequestBody User user) {
        user.setPassword(
            passwordEncoder.encode(user.getPassword())
        );
        return ResponseEntity.ok(
            userRepository.save(user)
        );
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted!");
    }

    // Update user role
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateRole(
            @PathVariable Long id,
            @RequestParam String role) {
        User user = userRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("User not found!"));
        user.setRole(role);
        return ResponseEntity.ok(
            userRepository.save(user)
        );
    }
}