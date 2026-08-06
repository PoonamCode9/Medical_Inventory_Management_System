package com.medicalinventory.backend.service;

import java.util.List;

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

    // Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User By ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Save User
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Update User
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if(existingUser != null ) {
            existingUser.setFullName(user.getFullName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());
            existingUser.setPhone(user.getPhone());
            existingUser.setRole(user.getRole());
            return userRepository.save(existingUser);
        }
        return null;
    }

    // Delete User
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        return new UserProfileDTO(
            user.getUserId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole() != null ? user.getRole().getRoleName() : "N/A"
        );
    }

    @Transactional
    public UserProfileDTO updateProfile(String email, UserProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found."));

        user.setFullName(dto.getFullName().trim());
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone().trim());
        }

        User updatedUser = userRepository.save(user);

        notificationService.createNotification(
            null, 
            "PROFILE_UPDATED", 
            "Profile details updated for user: " + updatedUser.getEmail(), 
            "Push"
        );

        return new UserProfileDTO(
            updatedUser.getUserId(),
            updatedUser.getFullName(),
            updatedUser.getEmail(),
            updatedUser.getPhone(),
            updatedUser.getRole().getRoleName()
        );
    }

    @Transactional
    public String changePassword(String email, ChangePasswordRequestDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

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
            "Push"
        );

        return "Password changed successfully.";
    }
}