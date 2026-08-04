package com.medistock.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;
import com.medistock.repository.UserRepository;
import com.medistock.service.UserService;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import com.medistock.service.JwtService;
import com.medistock.entity.Role;
import com.medistock.repository.RoleRepository;
import com.medistock.dto.UpdateProfileRequest;
import com.medistock.dto.ResetPasswordRequest;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
private final RoleRepository roleRepository;
private final JwtService jwtService;
private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
              RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,JwtService jwtService) {

        this.userRepository = userRepository;
         this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService=jwtService;
    }

    @Override
    public User register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByRoleName(request.getRole())
        .orElseThrow(() -> new RuntimeException("Role Not Found"));

user.setRole(role);

        return userRepository.save(user);
    }

    @Override
public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid Email"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid Password");
    }

    String token = jwtService.generateToken(user.getEmail());

return new LoginResponse(
        token,
        user.getName(),
        user.getEmail(),
        user.getRole().getRoleName()
);
}
@Override
public User getUserById(Long id) {

    return userRepository.findById(id).orElse(null);

}
@Override
public User getProfile(String email) {

    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User Not Found"));

}

@Override
public User updateProfile(String email, UpdateProfileRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User Not Found"));

    user.setName(request.getName());

    user.setEmail(request.getEmail());

    if (request.getPassword() != null &&
            !request.getPassword().isEmpty()) {

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

    }

    return userRepository.save(user);

}
@Override
public void resetPassword(String email, ResetPasswordRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User Not Found"));

    // Verify current password
    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
        throw new RuntimeException("Current Password is Incorrect");
    }

    // Encrypt and save new password
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));

    userRepository.save(user);
}
}