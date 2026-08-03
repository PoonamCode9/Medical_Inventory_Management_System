package com.medistock.backend.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medistock.backend.dto.LoginRequest;
import com.medistock.backend.dto.LoginResponse;
import com.medistock.backend.entity.Role;
import com.medistock.backend.entity.User;
import com.medistock.backend.repository.RoleRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.security.JwtService;
import com.medistock.backend.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;

public AuthServiceImpl(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RoleRepository roleRepository) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.roleRepository = roleRepository;
}

 @Override
public User register(User user) {

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setCreatedAt(LocalDateTime.now());

    Integer roleId = user.getRole().getRoleId();

    Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RuntimeException("Role not found"));

    user.setRole(role);

    return userRepository.save(user);
}
    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

return new LoginResponse(
        token,
        user.getRole().getRoleId(),
        user.getRole().getRoleName(),
        user.getFullName()
);
    }

}