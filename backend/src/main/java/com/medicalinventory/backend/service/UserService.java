package com.medicalinventory.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Add user (save)
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Update user 
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

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
