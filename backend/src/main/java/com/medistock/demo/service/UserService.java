package com.medistock.demo.service;

import com.medistock.demo.entity.Role;
import com.medistock.demo.entity.User;
import com.medistock.demo.repository.RoleRepository;
import com.medistock.demo.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =====================================
    // GET ALL USERS
    // =====================================

    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc();
    }

    // =====================================
    // GET USER BY ID
    // =====================================

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );
    }

    // =====================================
    // ADD USER (ADMIN)
    // =====================================

    public User addUser(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByPhone(user.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        if (user.getRole() == null) {
            throw new RuntimeException("Role is required");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // =====================================
    // UPDATE USER (ADMIN)
    // =====================================

    public User updateUser(Long id, User request) {

        User existingUser = getUserById(id);

        existingUser.setUsername(request.getUsername());
        existingUser.setFullName(request.getFullName());
        existingUser.setEmail(request.getEmail());
        existingUser.setPhone(request.getPhone());

        if (request.getPassword() != null
                && !request.getPassword().isEmpty()) {

            existingUser.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );
        }

        if (request.getRole() != null) {
            existingUser.setRole(request.getRole());
        }

        return userRepository.save(existingUser);
    }

    // =====================================
    // DELETE USER
    // =====================================

    public void deleteUser(Long id) {

        User user = getUserById(id);

        userRepository.delete(user);
    }

    // =====================================
    // CHANGE USER ROLE
    // =====================================

    public User updateRole(Long id, String roleName) {

        User user = getUserById(id);

        Role role = roleRepository
                .findByRoleName(roleName)
                .orElseThrow(
                        () -> new RuntimeException("Role not found")
                );

        user.setRole(role);

        return userRepository.save(user);
    }

    // =====================================
    // SEARCH USER BY EMAIL
    // =====================================

    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );
    }
}