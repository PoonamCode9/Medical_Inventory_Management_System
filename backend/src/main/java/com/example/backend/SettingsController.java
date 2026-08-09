package com.example.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SettingsController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "User not found"
            ));
        }

        User user = userOpt.get();

        Map<String, Object> body = new HashMap<>();
        body.put("id", user.getId());
        body.put("name", user.getName());
        body.put("email", user.getEmail());
        body.put("role", user.getRole());

        return ResponseEntity.ok(body);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> request
    ) {
        String email = authentication.getName();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        Map<String, Object> body = new HashMap<>();

        if (currentPassword == null || currentPassword.isBlank()
                || newPassword == null || newPassword.isBlank()) {
            body.put("success", false);
            body.put("message", "Current password and new password are required");
            return ResponseEntity.badRequest().body(body);
        }

        if (newPassword.length() < 6) {
            body.put("success", false);
            body.put("message", "New password must be at least 6 characters long");
            return ResponseEntity.badRequest().body(body);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            body.put("success", false);
            body.put("message", "User not found");
            return ResponseEntity.status(404).body(body);
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            body.put("success", false);
            body.put("message", "Current password is incorrect");
            return ResponseEntity.badRequest().body(body);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        body.put("success", true);
        body.put("message", "Password changed successfully");
        return ResponseEntity.ok(body);
    }
}
