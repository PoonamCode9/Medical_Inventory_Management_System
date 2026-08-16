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
import com.medistock.dto.ResetPasswordTokenRequest;
import com.medistock.dto.ForgotPasswordRequest;
import com.medistock.service.EmailService;

import java.util.UUID;
import java.util.Date;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Override
    public User register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
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

        // Keep the existing login email unless a non-empty email was supplied.
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }

    @Override
    public void resetPassword(String email, ResetPasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new RuntimeException("Current Password is Incorrect");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        String resetToken = UUID.randomUUID().toString();

        Date expiry = new Date(
                System.currentTimeMillis() + 15 * 60 * 1000
        );

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiry);
        userRepository.save(user);

        String resetLink =
                "http://localhost:3000/reset-password?token=" + resetToken;

        String body =
                "Hello " + user.getName() + ",\n\n" +
                "We received a request to reset your MediStock password.\n\n" +
                "Click the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "This link is valid for 15 minutes.\n\n" +
                "If you did not request a password reset, you can safely ignore this email.\n\n" +
                "Regards,\nMediStock";

        emailService.sendEmail(
                user.getEmail(),
                "MediStock - Password Reset",
                body
        );
    }

    @Override
    public void resetPasswordWithToken(ResetPasswordTokenRequest request) {

        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid Reset Token"));

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().before(new Date())) {

            throw new RuntimeException("Reset Token Expired");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }

    @Override
    public User findOrCreateGoogleUser(String name, String email) {

        return userRepository.findByEmail(email)
                .orElseGet(() -> {

                    User user = new User();

                    user.setName(name);
                    user.setEmail(email);

                    user.setPassword(
                            passwordEncoder.encode(UUID.randomUUID().toString())
                    );

                    Role role = roleRepository.findByRoleName("STAFF")
                            .orElseThrow(() ->
                                    new RuntimeException("STAFF role not found"));

                    user.setRole(role);

                    return userRepository.save(user);
                });
    }
}
