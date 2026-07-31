package com.example.backend;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationRepository notificationRepository;

    public AdminUserController(UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationRepository = notificationRepository;
    }


    @GetMapping
    public ResponseEntity<List<User>> listUsers() {
        // For admin table we return entities; frontend will display only non-sensitive fields.
        return ResponseEntity.ok(userRepository.findAll());
    }


    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (request == null
                || request.getName() == null || request.getName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getRole() == null || request.getRole().isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "message", "Name, email, password and role are required"
            ));
        }

        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "message", "Email already registered"
            ));
        }

        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = new User(request.getName(), request.getEmail(), encryptedPassword, request.getRole());
        User saved = userRepository.save(newUser);

        return ResponseEntity.ok(java.util.Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "email", saved.getEmail(),
                "role", saved.getRole()
        ));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Delete all notifications for this user first (to avoid FK violation)
        List<Notification> userNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(id);
        if (!userNotifications.isEmpty()) {
            notificationRepository.deleteAll(userNotifications);
        }

        try {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Cannot delete user ID " + id + " — the user is still referenced by other records (e.g., purchase orders, tasks, dispenses). Remove or reassign those records first."
            ));
        }
    }

    public static class CreateUserRequest {
        private String name;
        private String email;
        private String password;
        private String role;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}

