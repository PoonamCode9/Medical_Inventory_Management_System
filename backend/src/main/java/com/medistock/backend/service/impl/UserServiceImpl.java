package com.medistock.backend.service.impl;

import com.medistock.backend.dto.request.UserRequest;
import com.medistock.backend.dto.response.UserResponse;
import com.medistock.backend.entity.Role;
import com.medistock.backend.entity.User;
import com.medistock.backend.exception.DuplicateResourceException;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.repository.RoleRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.NotificationService;
import com.medistock.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse createUser(UserRequest userRequest) {
        log.info("Attempting to provision user with email: {}", userRequest.getEmail());

        // 1. Input Sanitization & HTML/JS rejection
        String fullName = sanitizeAndValidate(userRequest.getFullName(), "Full Name");
        String email = sanitizeAndValidate(userRequest.getEmail(), "Email").toLowerCase();
        String phone = sanitizeAndValidate(userRequest.getPhone(), "Phone number");
        String password = userRequest.getPassword(); // Password details validated separately

        // 2. Reject ADMIN creation through UI/API
        if (userRequest.getRoleId() != null && userRequest.getRoleId() == 1) {
            log.error("Security violation: Attempted ADMIN creation via user management");
            throw new IllegalArgumentException("Creating or updating Administrator accounts is restricted.");
        }

        // 3. Duplicate Email Validation
        if (userRepository.findByEmail(email).isPresent()) {
            log.warn("Validation failed: Email already exists: {}", email);
            throw new DuplicateResourceException("Email already exists.");
        }

        // 4. Duplicate Phone Validation
        if (userRepository.findByPhone(phone).isPresent()) {
            log.warn("Validation failed: Phone already exists: {}", phone);
            throw new DuplicateResourceException("Phone number already exists.");
        }

        // 5. Password Validation (Required for Create)
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required for new users");
        }
        validatePasswordStrength(password);

        // Fetch Role
        Role role = roleRepository.findById(userRequest.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + userRequest.getRoleId()));

        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .password(passwordEncoder.encode(password))
                .role(role)
                .status(userRequest.getStatus() != null ? userRequest.getStatus() : true)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);
        
        // Notify user creation
        notificationService.createNotification(
                null,
                "New User Account Registered",
                "A new user account for \"" + saved.getFullName() + "\" (" + saved.getEmail() + ") was provisioned as " + role.getRoleName() + ".",
                "INFO",
                "LOW",
                "USER",
                saved.getUserId()
        );

        log.info("User created successfully with ID: {}", saved.getUserId());
        return mapToUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Integer userId, UserRequest userRequest) {
        log.info("Attempting to update user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Prevents modification of Administrator accounts via user list
        if (user.getRole() != null && user.getRole().getRoleId() == 1) {
            throw new IllegalArgumentException("Updating Administrator accounts is restricted.");
        }

        // 1. Input Sanitization & HTML/JS rejection
        String fullName = sanitizeAndValidate(userRequest.getFullName(), "Full Name");
        String email = sanitizeAndValidate(userRequest.getEmail(), "Email").toLowerCase();
        String phone = sanitizeAndValidate(userRequest.getPhone(), "Phone number");
        String password = userRequest.getPassword();

        // 2. Reject role escalations to ADMIN
        if (userRequest.getRoleId() != null && userRequest.getRoleId() == 1) {
            throw new IllegalArgumentException("Upgrading accounts to Administrator is restricted.");
        }

        // 3. Email uniqueness excluding current user
        Optional<User> emailOwner = userRepository.findByEmail(email);
        if (emailOwner.isPresent() && !emailOwner.get().getUserId().equals(userId)) {
            throw new DuplicateResourceException("Email already exists.");
        }

        // 4. Phone uniqueness excluding current user
        Optional<User> phoneOwner = userRepository.findByPhone(phone);
        if (phoneOwner.isPresent() && !phoneOwner.get().getUserId().equals(userId)) {
            throw new DuplicateResourceException("Phone number already exists.");
        }

        // 5. Password Validation (Optional for Update)
        if (password != null && !password.trim().isEmpty()) {
            validatePasswordStrength(password);
            user.setPassword(passwordEncoder.encode(password));
        }

        Role role = roleRepository.findById(userRequest.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + userRequest.getRoleId()));

        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(role);
        if (userRequest.getStatus() != null) {
            user.setStatus(userRequest.getStatus());
        }

        boolean isPasswordUpdated = (password != null && !password.trim().isEmpty());

        User updated = userRepository.save(user);
        log.info("User ID: {} updated successfully", userId);

        if (isPasswordUpdated) {
            notificationService.createNotification(
                    updated.getEmail(),
                    "Password Changed",
                    "Security alert: The password for account \"" + updated.getEmail() + "\" was successfully updated.",
                    "SUCCESS",
                    "MEDIUM",
                    "USER",
                    updated.getUserId()
            );
        } else {
            notificationService.createNotification(
                    updated.getEmail(),
                    "Profile Updated",
                    "Account profile details for \"" + updated.getEmail() + "\" were successfully updated.",
                    "INFO",
                    "LOW",
                    "USER",
                    updated.getUserId()
            );
        }

        return mapToUserResponse(updated);
    }

    @Override
    @Transactional
    public void deleteUser(Integer userId) {
        log.info("Attempting to delete user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (user.getRole() != null && user.getRole().getRoleId() == 1) {
            throw new IllegalArgumentException("Deleting Administrator accounts is restricted.");
        }

        userRepository.delete(user);
        log.info("User ID: {} deleted successfully", userId);
    }

    // Helper: Map User entity to UserResponse DTO
    private UserResponse mapToUserResponse(User user) {
        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "VIEWER";
        if (roleName.startsWith("ROLE_")) {
            roleName = roleName.substring(5);
        }
        return UserResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(roleName)
                .status(user.getStatus() != null && user.getStatus() ? "Active" : "Inactive")
                .lastLogin("Never")
                .build();
    }

    // Helper: Input sanitization, collapses spacing and removes tags/injection chars
    private String sanitizeAndValidate(String input, String fieldName) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }

        // Remove invisible control characters
        String sanitized = input.replaceAll("[\\p{Cc}\\p{Cf}\\p{Co}\\p{Cn}]", "");
        // Collapse spaces
        sanitized = sanitized.replaceAll("\\s+", " ").trim();

        // Reject HTML / Script injections
        String lower = sanitized.toLowerCase();
        if (lower.contains("<script") || lower.contains("</script") || 
            lower.contains("<html") || lower.contains("<body") ||
            lower.contains("javascript:") || lower.contains("onload=") || 
            lower.contains("onerror=") || 
            lower.matches(".*<[^>]+>.*")) {
            log.error("Malicious input detected in field: {}", fieldName);
            throw new IllegalArgumentException(fieldName + " contains illegal script characters.");
        }

        return sanitized;
    }

    // Helper: Strict Password validation rules
    private void validatePasswordStrength(String password) {
        if (password.length() < 8 || password.length() > 30) {
            throw new IllegalArgumentException("Password must be between 8 and 30 characters.");
        }
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        String specialChars = "!@#$%^&*()_+=-{}[]|\\:;\"'<>,.?/";
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (specialChars.indexOf(c) >= 0) hasSpecial = true;
        }
        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            throw new IllegalArgumentException("Password must contain uppercase, lowercase, number and special character.");
        }
    }
}
