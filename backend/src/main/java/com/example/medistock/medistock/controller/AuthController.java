package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.config.JwtUtil;
import com.example.medistock.medistock.model.Role;
import com.example.medistock.medistock.model.User;
import com.example.medistock.medistock.repository.RoleRepository;
import com.example.medistock.medistock.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // GET ALL USERS
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // UPDATE LOGGED-IN USER PROFILE (Name/Username, Email, Password)
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String currentUsername = request.get("currentUsername");
        String newUsername = request.get("newUsername");
        String newEmail = request.get("newEmail");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (currentUsername == null || currentUsername.isBlank()) {
            return ResponseEntity.badRequest().body("Current username is required");
        }

        // Allow updating admin profile
        if ("admin".equals(currentUsername)) {
            Optional<User> adminInDb = userRepository.findByUsername("admin");
            if (adminInDb.isPresent()) {
                User adminUser = adminInDb.get();
                if (newUsername != null && !newUsername.isBlank() && !newUsername.equals("admin")) {
                    if (userRepository.findByUsername(newUsername).isEmpty()) {
                        adminUser.setUsername(newUsername);
                    }
                }
                if (newEmail != null && !newEmail.isBlank()) {
                    adminUser.setEmail(newEmail);
                }
                if (newPassword != null && !newPassword.isBlank() && (currentPassword == null || passwordEncoder.matches(currentPassword, adminUser.getPassword()))) {
                    adminUser.setPassword(passwordEncoder.encode(newPassword));
                }
                userRepository.save(adminUser);
            }
            Map<String, String> response = new HashMap<>();
            response.put("username", newUsername != null && !newUsername.isBlank() ? newUsername : "admin");
            response.put("email", newEmail != null && !newEmail.isBlank() ? newEmail : "admin@medistock.com");
            response.put("message", "Admin profile updated successfully");
            return ResponseEntity.ok(response);
        }

        Optional<User> userOptional = userRepository.findByUsername(currentUsername);
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByEmail(currentUsername);
        }

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOptional.get();

        // 1. Update Username if changed
        if (newUsername != null && !newUsername.isBlank() && !newUsername.equals(user.getUsername())) {
            if (userRepository.findByUsername(newUsername).isPresent()) {
                return ResponseEntity.badRequest().body("Username is already taken");
            }
            user.setUsername(newUsername);
        }

        // 2. Update Email if provided
        if (newEmail != null && !newEmail.isBlank()) {
            user.setEmail(newEmail);
        }

        // 3. Update Password if provided
        if (newPassword != null && !newPassword.isBlank()) {
            if (currentPassword == null || !passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("Current password verification failed");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("message", "Profile updated successfully");

        return ResponseEntity.ok(response);
    }

    // REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String email = request.get("email");
        String roleName = request.get("role");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (email != null && !email.isBlank() && userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already registered!");
        }

        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        Role userRole;
        if (roleOpt.isEmpty()) {
            Role newRole = new Role();
            newRole.setName(roleName);
            userRole = roleRepository.save(newRole);
        } else {
            userRole = roleOpt.get();
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setEmail(email);
        newUser.setRole(userRole);
        newUser.setStatus("ACTIVE");

        userRepository.save(newUser);

        return ResponseEntity.ok("Success: User " + username + " registered successfully as " + roleName);
    }

    // LOGIN USER (Supports login by username OR registered email)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String usernameOrEmail = credentials.get("username");
        String password = credentials.get("password");

        if (usernameOrEmail == null || password == null) {
            return ResponseEntity.badRequest().body("Username/Email and Password are required");
        }

        Map<String, String> response = new HashMap<>();

        // 1. Built-in Admin demo credentials
        if ("admin".equalsIgnoreCase(usernameOrEmail) && "admin123".equals(password)) {
            String token = jwtUtil.generateToken("admin", "ROLE_ADMIN");
            Optional<User> adminInDb = userRepository.findByUsername("admin");
            response.put("token", token);
            response.put("role", "ROLE_ADMIN");
            response.put("username", "admin");
            response.put("email", adminInDb.map(User::getEmail).filter(e -> e != null && !e.isBlank()).orElse("admin@medistock.com"));
            adminInDb.ifPresent(u -> response.put("id", String.valueOf(u.getId())));
            return ResponseEntity.ok(response);
        }

        // 2. Built-in Pharmacist demo credentials
        if ("pharmacist".equalsIgnoreCase(usernameOrEmail) && "pharmacist123".equals(password)) {
            String token = jwtUtil.generateToken("pharmacist", "ROLE_PHARMACIST");
            Optional<User> pharmInDb = userRepository.findByUsername("pharmacist");
            response.put("token", token);
            response.put("role", "ROLE_PHARMACIST");
            response.put("username", "pharmacist");
            response.put("email", pharmInDb.map(User::getEmail).filter(e -> e != null && !e.isBlank()).orElse("pharmacist@medistock.com"));
            pharmInDb.ifPresent(u -> response.put("id", String.valueOf(u.getId())));
            return ResponseEntity.ok(response);
        }

        // 3. Built-in Staff demo credentials
        if ("staff".equalsIgnoreCase(usernameOrEmail) && "staff123".equals(password)) {
            String token = jwtUtil.generateToken("staff", "ROLE_STAFF");
            Optional<User> staffInDb = userRepository.findByUsername("staff");
            response.put("token", token);
            response.put("role", "ROLE_STAFF");
            response.put("username", "staff");
            response.put("email", staffInDb.map(User::getEmail).filter(e -> e != null && !e.isBlank()).orElse("staff@medistock.com"));
            staffInDb.ifPresent(u -> response.put("id", String.valueOf(u.getId())));
            return ResponseEntity.ok(response);
        }

        // 4. Registered user in database (check by username or email)
        Optional<User> dbUser = userRepository.findByUsername(usernameOrEmail);
        if (dbUser.isEmpty()) {
            dbUser = userRepository.findByEmail(usernameOrEmail);
        }

        if (dbUser.isPresent() && passwordEncoder.matches(password, dbUser.get().getPassword())) {
            User user = dbUser.get();
            String roleName = user.getRole() != null ? user.getRole().getName() : "ROLE_STAFF";
            String token = jwtUtil.generateToken(user.getUsername(), roleName);

            response.put("token", token);
            response.put("role", roleName);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail() != null && !user.getEmail().isBlank() ? user.getEmail() : (user.getUsername() + "@medistock.com"));
            if (user.getId() != null) {
                response.put("id", String.valueOf(user.getId()));
            }
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}