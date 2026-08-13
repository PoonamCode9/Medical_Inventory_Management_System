package com.medicalinventory.backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicalinventory.backend.dto.ChangePasswordRequestDTO;
import com.medicalinventory.backend.dto.UserProfileDTO;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User saveUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = auth != null ? auth.getName() : null;

        if (currentEmail != null && currentEmail.equalsIgnoreCase(existingUser.getEmail())) {
            if (user.getRole() != null && existingUser.getRole() != null &&
                !existingUser.getRole().getRoleId().equals(user.getRole().getRoleId())) {
                throw new RuntimeException("Action Denied: You cannot change your own role!");
            }
        }

        existingUser.setFullName(user.getFullName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());
        existingUser.setRole(user.getRole());

        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            boolean isAlreadyEncoded = user.getPassword().startsWith("$2a$") ||
                    user.getPassword().startsWith("$2b$") ||
                    user.getPassword().startsWith("$2y$");

            if (!isAlreadyEncoded) {
                existingUser.setPassword(passwordEncoder.encode(user.getPassword().trim()));
            }
        }
        return userRepository.save(existingUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = auth != null ? auth.getName() : null;

        if (currentEmail != null && currentEmail.equalsIgnoreCase(userToDelete.getEmail())) {
            throw new RuntimeException("Action Denied: You cannot delete your own logged-in account!");
        }

        String userEmail = userToDelete.getEmail();
        userRepository.delete(userToDelete);

        notificationService.createNotification(
                null,
                "USER_DELETED",
                "User account deleted for: " + userEmail,
                "Push");
    }

    
    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        boolean hasPass = user.getPassword() != null && !user.getPassword().trim().isEmpty();

        return new UserProfileDTO(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole() != null ? user.getRole().getRoleName() : "N/A",
                hasPass);
    }

    @Transactional
    public UserProfileDTO updateProfile(String email, UserProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found."));

        user.setFullName(dto.getFullName().trim());

        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {
            user.setPhone(dto.getPhone().trim());
        } else {
            user.setPhone(null);
        }

        User updatedUser = userRepository.save(user);

        notificationService.createNotification(
                null,
                "PROFILE_UPDATED",
                "Profile details updated for user: " + updatedUser.getEmail(),
                "Push");

        boolean hasPass = updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty();

        return new UserProfileDTO(
                updatedUser.getUserId(),
                updatedUser.getFullName(),
                updatedUser.getEmail(),
                updatedUser.getPhone(),
                updatedUser.getRole() != null ? updatedUser.getRole().getRoleName() : "N/A",
                hasPass);
    }

    @Transactional
    public String changePassword(String email, ChangePasswordRequestDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Google users cannot change password directly.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password provided is incorrect.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password cannot be identical to the old password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        notificationService.createNotification(
                null,
                "PASSWORD_CHANGED",
                "Security Alert: Password changed for " + user.getEmail(),
                "Push");

        return "Password changed successfully.";
    }
}