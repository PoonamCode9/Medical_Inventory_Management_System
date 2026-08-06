package com.medicalinventory.backend.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

import jakarta.transaction.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RoleRepository roleRepository;
    private final NotificationService notificationService;
    private final JavaMailSender mailSender;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, JwtUtil jwtUtil, RoleRepository roleRepository,
            NotificationService notificationService, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.roleRepository = roleRepository;
        this.notificationService = notificationService;
        this.mailSender = mailSender;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        return new LoginResponse(token, user.getRole().getRoleName());
    }

    @Transactional
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Role role = roleRepository.findByRoleName("Staff").orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);
        User savedUser = userRepository.save(user);

        notificationService.createNotification(null, "USER_REGISTERED",
                "New " + savedUser.getRole().getRoleName() + " account created.", "Push");

        return savedUser;
    }

    @Transactional
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);

        user.setResetToken(otp);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("MediStock - Password Reset OTP");
            message.setText("Hello " + user.getFullName() + ",\n\n"
                    + "Your OTP for resetting your password is: " + otp + "\n\n"
                    + "This OTP is valid for 15 minutes. If you did not request this, please ignore this email.");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email. Please check your network or mail configuration.");
        }

        return "Password reset OTP sent successfully to your email.";
    }

    @Transactional
    public String resetPassword(String otp, String newPassword) {
        User user = userRepository.findByResetToken(otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP provided."));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return "Password reset successfully. You can now log in with your new password.";
    }
}
