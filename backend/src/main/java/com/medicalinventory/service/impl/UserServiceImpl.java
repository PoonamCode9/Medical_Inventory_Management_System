package com.medicalinventory.service.impl;

import com.medicalinventory.entity.User;
import com.medicalinventory.repository.UserRepository;
import com.medicalinventory.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Long getUserCount() {
        return userRepository.count();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ==============================
    // EDIT PROFILE
    // ==============================

    @Override
    public User updateUser(Long id, User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update only profile information
        existingUser.setFullName(
                updatedUser.getFullName());

        existingUser.setUsername(
                updatedUser.getUsername());

        existingUser.setEmail(
                updatedUser.getEmail());

        // Password and Role are NOT changed here

        return userRepository.save(existingUser);
    }

    // ==============================
    // CHANGE PASSWORD
    // ==============================

    @Override
    public void changePassword(
            Long id,
            String currentPassword,
            String newPassword) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check current password
        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect");
        }

        // Encrypt new password
        String encodedPassword = passwordEncoder.encode(newPassword);

        user.setPassword(encodedPassword);

        userRepository.save(user);
    }
}