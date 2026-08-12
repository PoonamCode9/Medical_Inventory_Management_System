package com.medistock.demo.controller;

import com.medistock.demo.dto.AuthResponse;
import com.medistock.demo.dto.LoginRequest;
import com.medistock.demo.dto.RegisterRequest;
import com.medistock.demo.dto.OtpRequest;
import com.medistock.demo.dto.OtpVerifyRequest;
import com.medistock.demo.dto.ForgotPasswordRequest;
import com.medistock.demo.dto.VerifyResetOtpRequest;
import com.medistock.demo.dto.ResetPasswordRequest;

import com.medistock.demo.entity.User;
import com.medistock.demo.repository.UserRepository;

import com.medistock.demo.service.AuthService;
import com.medistock.demo.service.OtpService;
import com.medistock.demo.service.JwtService;
import com.medistock.demo.service.PasswordResetService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {


    private final AuthService authService;

    private final OtpService otpService;

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final PasswordResetService passwordResetService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AuthController(
            AuthService authService,
            OtpService otpService,
            UserRepository userRepository,
            JwtService jwtService,
            PasswordResetService passwordResetService
    ) {

        this.authService = authService;

        this.otpService = otpService;

        this.userRepository = userRepository;

        this.jwtService = jwtService;

        this.passwordResetService = passwordResetService;
    }


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }


    // =========================================================
    // SEND MOBILE OTP
    // =========================================================

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(
            @RequestBody OtpRequest request
    ) {

        if (
                request.getPhone() == null ||
                request.getPhone().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Mobile number is required"
                    );
        }


        User user = userRepository
                .findByPhone(
                        request.getPhone().trim()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with this mobile number"
                        )
                );


        if (
                user.getPhone() == null ||
                user.getPhone().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Mobile number not registered"
                    );
        }


        otpService.generateOtp(
                user.getPhone()
        );


        return ResponseEntity.ok(
                "OTP sent successfully"
        );
    }


    // =========================================================
    // VERIFY MOBILE OTP
    // =========================================================

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(
            @RequestBody OtpVerifyRequest request
    ) {

        boolean valid =
                otpService.verifyOtp(
                        request.getPhone(),
                        request.getOtp()
                );


        if (!valid) {

            throw new RuntimeException(
                    "Invalid or expired OTP"
            );
        }


        User user =
                userRepository
                        .findByPhone(
                                request.getPhone()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        if (user.getRole() == null) {

            throw new RuntimeException(
                    "User role not assigned"
            );
        }


        String role =
                user.getRole()
                        .getRoleName()
                        .toUpperCase();


        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        role
                );


        otpService.clearOtp(
                request.getPhone()
        );


        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        role,
                        user.getId()
                )
        );
    }


    // =========================================================
    // FORGOT PASSWORD
    // SEND EMAIL OTP
    // =========================================================

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<String> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordRequest request
    ) {

        if (
                request.getEmail() == null ||
                request.getEmail().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Email address is required"
                    );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No account found with this email address"
                                )
                        );


        passwordResetService.sendResetOtp(
                user.getEmail()
        );


        return ResponseEntity.ok(
                "Password reset OTP sent successfully"
        );
    }


    // =========================================================
    // FORGOT PASSWORD
    // VERIFY EMAIL OTP
    // =========================================================

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<String> verifyForgotPasswordOtp(
            @RequestBody VerifyResetOtpRequest request
    ) {

        if (
                request.getEmail() == null ||
                request.getEmail().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Email address is required"
                    );
        }


        if (
                request.getOtp() == null ||
                request.getOtp().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "OTP is required"
                    );
        }


        boolean valid =
                passwordResetService.verifyOtp(
                        request.getEmail()
                                .trim()
                                .toLowerCase(),
                        request.getOtp()
                );


        if (!valid) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid or expired OTP"
                    );
        }


        return ResponseEntity.ok(
                "OTP verified successfully"
        );
    }


    // =========================================================
    // FORGOT PASSWORD
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        // -----------------------------------------------------
        // EMAIL VALIDATION
        // -----------------------------------------------------

        if (
                request.getEmail() == null ||
                request.getEmail().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Email is required"
                    );
        }


        // -----------------------------------------------------
        // OTP VALIDATION
        // -----------------------------------------------------

        if (
                request.getOtp() == null ||
                request.getOtp().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "OTP is required"
                    );
        }


        // -----------------------------------------------------
        // PASSWORD VALIDATION
        // -----------------------------------------------------

        if (
                request.getNewPassword() == null ||
                request.getNewPassword().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "New password is required"
                    );
        }


        if (
                request.getNewPassword().length() < 6
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Password must contain at least 6 characters"
                    );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // -----------------------------------------------------
        // VERIFY OTP
        // -----------------------------------------------------

        boolean valid =
                passwordResetService.verifyOtp(
                        email,
                        request.getOtp()
                );


        if (!valid) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid or expired OTP"
                    );
        }


        // -----------------------------------------------------
        // RESET PASSWORD
        // -----------------------------------------------------

        authService.resetPassword(
                email,
                request.getNewPassword()
        );


        // -----------------------------------------------------
        // CLEAR OTP
        // -----------------------------------------------------

        passwordResetService.clearOtp(
                email
        );


        return ResponseEntity.ok(
                "Password reset successfully"
        );
    }
}