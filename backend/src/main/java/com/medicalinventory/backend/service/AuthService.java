package com.medicalinventory.backend.service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.medicalinventory.backend.dto.LoginRequest;
import com.medicalinventory.backend.dto.LoginResponse;
import com.medicalinventory.backend.entity.Role;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.RoleRepository;
import com.medicalinventory.backend.repository.UserRepository;
import com.medicalinventory.backend.security.jwt.JwtUtil;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RoleRepository roleRepository;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil, RoleRepository roleRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.roleRepository = roleRepository;
        this.notificationService = notificationService;
    }

    
    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch(Exception e) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        return new LoginResponse(token, user.getRole().getRoleName());
    }

    public User register(User user) {
        if(userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Role role = roleRepository.findByRoleName("Staff").orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);
        User savedUser =  userRepository.save(user);

        notificationService.createNotification(null, "USER_REGISTERED", "New " + savedUser.getRole().getRoleName() + " account created.", "Push");

        return savedUser;
    }
}
