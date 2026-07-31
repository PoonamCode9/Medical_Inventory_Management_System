package com.example.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Map<String, Object> body = new HashMap<>();

        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            body.put("success", false);
            body.put("message", "Email and password are required");
            return ResponseEntity.badRequest().body(body);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            body.put("success", false);
            body.put("message", "User not found");
            return ResponseEntity.badRequest().body(body);
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            body.put("success", false);
            body.put("message", "Invalid password");
            return ResponseEntity.badRequest().body(body);
        }

        String token = jwtService.generateToken(user);

        Map<String, Object> userBody = new HashMap<>();
        userBody.put("id", user.getId());
        userBody.put("name", user.getName());
        userBody.put("email", user.getEmail());
        userBody.put("role", user.getRole());

        body.put("success", true);
        body.put("message", "Login successful");
        body.put("token", token);
        body.put("tokenType", "Bearer");
        body.put("user", userBody);

        return ResponseEntity.ok(body);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String role = request.get("role");

        Map<String, Object> body = new HashMap<>();

        if (name == null || email == null || password == null || role == null
                || name.isBlank() || email.isBlank() || password.isBlank() || role.isBlank()) {
            body.put("success", false);
            body.put("message", "Name, email, password and role are required");
            return ResponseEntity.badRequest().body(body);
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            body.put("success", false);
            body.put("message", "Email already registered");
            return ResponseEntity.badRequest().body(body);
        }

        String encryptedPassword = passwordEncoder.encode(password);
        User newUser = new User(name, email, encryptedPassword, role);

        User savedUser = userRepository.save(newUser);

        Map<String, Object> userBody = new HashMap<>();
        userBody.put("id", savedUser.getId());
        userBody.put("name", savedUser.getName());
        userBody.put("email", savedUser.getEmail());
        userBody.put("role", savedUser.getRole());

        body.put("success", true);
        body.put("message", "Registration successful");
        body.put("user", userBody);

        return ResponseEntity.ok(body);
    }
}
