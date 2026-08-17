package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.model.Role;
import com.example.medistock.medistock.model.User;
import com.example.medistock.medistock.repository.RoleRepository;
import com.example.medistock.medistock.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            String email = (String) payload.get("email");
            String rawPassword = (String) payload.get("password");
            String roleName = (String) payload.getOrDefault("role", payload.get("roleName"));
            String status = (String) payload.getOrDefault("status", "ACTIVE");

            if (username == null || username.isBlank()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (userRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.badRequest().body("Username is already taken");
            }

            User user = new User();
            user.setUsername(username);
            user.setEmail(email != null && !email.isBlank() ? email : username + "@medistock.com");
            user.setPassword(passwordEncoder.encode(rawPassword != null && !rawPassword.isBlank() ? rawPassword : "password123"));
            user.setStatus(status != null ? status.toUpperCase() : "ACTIVE");
            user.setCreatedAt(Timestamp.from(Instant.now()));

            if (roleName != null && !roleName.isBlank()) {
                String normalizedRole = roleName.toUpperCase();
                if (!normalizedRole.startsWith("ROLE_")) {
                    normalizedRole = "ROLE_" + normalizedRole;
                }
                Optional<Role> roleOpt = roleRepository.findByName(normalizedRole);
                if (roleOpt.isPresent()) {
                    user.setRole(roleOpt.get());
                } else {
                    Role newRole = new Role();
                    newRole.setName(normalizedRole);
                    user.setRole(roleRepository.save(newRole));
                }
            } else {
                roleRepository.findByName("ROLE_STAFF").ifPresent(user::setRole);
            }

            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to create user: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return userRepository.findById(id).map(user -> {
            if (payload.containsKey("username")) {
                String newUsername = (String) payload.get("username");
                if (newUsername != null && !newUsername.isBlank() && !newUsername.equals(user.getUsername())) {
                    if (userRepository.findByUsername(newUsername).isPresent()) {
                        return ResponseEntity.badRequest().body("Username is already taken");
                    }
                    user.setUsername(newUsername);
                }
            }

            if (payload.containsKey("email")) {
                String newEmail = (String) payload.get("email");
                if (newEmail != null && !newEmail.isBlank()) {
                    user.setEmail(newEmail);
                }
            }

            if (payload.containsKey("password")) {
                String newPassword = (String) payload.get("password");
                if (newPassword != null && !newPassword.isBlank()) {
                    user.setPassword(passwordEncoder.encode(newPassword));
                }
            }

            if (payload.containsKey("status")) {
                String status = (String) payload.get("status");
                if (status != null && !status.isBlank()) {
                    user.setStatus(status.toUpperCase());
                }
            }

            if (payload.containsKey("role") || payload.containsKey("roleName")) {
                String roleName = (String) payload.getOrDefault("role", payload.get("roleName"));
                if (roleName != null && !roleName.isBlank()) {
                    String normalizedRole = roleName.toUpperCase();
                    if (!normalizedRole.startsWith("ROLE_")) {
                        normalizedRole = "ROLE_" + normalizedRole;
                    }
                    Optional<Role> roleOpt = roleRepository.findByName(normalizedRole);
                    if (roleOpt.isPresent()) {
                        user.setRole(roleOpt.get());
                    } else {
                        Role newRole = new Role();
                        newRole.setName(normalizedRole);
                        user.setRole(roleRepository.save(newRole));
                    }
                }
            }

            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
