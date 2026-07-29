package com.medistock.backend.service.impl;

import com.medistock.backend.dto.request.LoginRequest;
import com.medistock.backend.dto.request.RegisterRequest;
import com.medistock.backend.dto.response.JwtResponse;
import com.medistock.backend.entity.Role;
import com.medistock.backend.entity.User;
import com.medistock.backend.exception.DuplicateResourceException;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.repository.RoleRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.security.CustomUserDetailsService;
import com.medistock.backend.security.JwtService;
import com.medistock.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public String register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email is already registered");
        }

        Role role = roleRepository.findById(registerRequest.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + registerRequest.getRoleId()));

        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phone(registerRequest.getPhone())
                .role(role)
                .status(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    @Override
    public JwtResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        
        // Add roles/authorities to the token claims
        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
        if (!userDetails.getAuthorities().isEmpty()) {
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            extraClaims.put("role", role);
        }
        
        String jwtToken = jwtService.generateToken(extraClaims, userDetails);

        return JwtResponse.builder()
                .token(jwtToken)
                .email(userDetails.getUsername())
                .type("Bearer")
                .build();
    }
}
