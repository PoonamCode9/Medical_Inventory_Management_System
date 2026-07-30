package com.medistock.backend.controller;

import com.medistock.backend.dto.UserDTO;
import com.medistock.backend.exception.BadRequestException;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.model.Role;
import com.medistock.backend.model.User;
import com.medistock.backend.repository.RoleRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return ResponseEntity.ok(new UserDTO(user));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setEnabled(!user.isEnabled());
        User updated = userRepository.save(user);

        auditLogService.logAction("TOGGLE_USER_STATUS", "Toggled status of user " + user.getEmail() + " to: " + user.isEnabled());

        return ResponseEntity.ok(new UserDTO(updated));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long id, @RequestParam String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));

        user.setRole(role);
        User updated = userRepository.save(user);

        auditLogService.logAction("CHANGE_USER_ROLE", "Changed role of user " + user.getEmail() + " to: " + role.getName());

        return ResponseEntity.ok(new UserDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(user);

        auditLogService.logAction("DELETE_USER", "Deleted user account: " + user.getEmail());

        return ResponseEntity.ok("User deleted successfully!");
    }
}
