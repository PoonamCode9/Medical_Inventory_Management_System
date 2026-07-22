package com.medical.om.om_backend.service;

import com.medical.om.om_backend.Dto.AuthReq;
import com.medical.om.om_backend.Dto.LoginReq;
import com.medical.om.om_backend.Dto.RegisterReq;
import com.medical.om.om_backend.entity.Users;
import com.medical.om.om_backend.repository.UserRepository;
import com.medical.om.om_backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service class handling the business logic for user registration and authentication/login.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registers a new user in the system after validating that the username is not already taken.
     * The password is encrypted using BCrypt before storing it in the database.
     */
    public Users register(RegisterReq request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username '" + request.getUsername() + "' is already taken.");
        }

        Users user = new Users();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        // Cryptographically hash the raw password using BCrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    /**
     * Authenticates credentials using Spring's AuthenticationManager.
     * If successful, a JWT token is generated and returned inside AuthReq DTO.
     */
    public AuthReq login(LoginReq request) {
        // This will verify credentials and throw an AuthenticationException if invalid
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Fetch the user from the database to extract information for the JWT token
        Users user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getUsername()));

        // Generate JWT token containing the username and their assigned role
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return new AuthReq(token);
    }
}
