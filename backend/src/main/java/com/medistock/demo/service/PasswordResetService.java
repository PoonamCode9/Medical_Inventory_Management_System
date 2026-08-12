package com.medistock.demo.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class PasswordResetService {

    private final JavaMailSender mailSender;


    private final SecureRandom random =
            new SecureRandom();


    /*
     * Stores:
     *
     * email -> OTP information
     */
    private final Map<String, OtpData> otpStore =
            new ConcurrentHashMap<>();


    public PasswordResetService(
            JavaMailSender mailSender
    ) {

        this.mailSender = mailSender;
    }


    // =========================================================
    // SEND RESET OTP
    // =========================================================

    public void sendResetOtp(String email) {

        String normalizedEmail =
                email.trim().toLowerCase();


        // Generate 6 digit OTP

        String otp = String.format(
                "%06d",
                random.nextInt(1_000_000)
        );


        // OTP expires after 5 minutes

        LocalDateTime expiry =
                LocalDateTime.now()
                        .plusMinutes(5);


        otpStore.put(
                normalizedEmail,
                new OtpData(
                        otp,
                        expiry
                )
        );


        // =====================================================
        // EMAIL
        // =====================================================

        SimpleMailMessage message =
                new SimpleMailMessage();


        message.setTo(
                normalizedEmail
        );


        message.setSubject(
                "MediStock - Password Reset OTP"
        );


        message.setText(
                "Dear MediStock User,\n\n"
                + "Your password reset OTP is:\n\n"
                + otp
                + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "If you did not request a password reset, "
                + "please ignore this email.\n\n"
                + "Regards,\n"
                + "MediStock Healthcare Team"
        );


        mailSender.send(message);
    }


    // =========================================================
    // VERIFY OTP
    // =========================================================

    public boolean verifyOtp(
            String email,
            String otp
    ) {

        if (email == null ||
                otp == null) {

            return false;
        }


        String normalizedEmail =
                email.trim().toLowerCase();


        OtpData data =
                otpStore.get(
                        normalizedEmail
                );


        if (data == null) {

            return false;
        }


        // Check expiration

        if (
                LocalDateTime.now()
                        .isAfter(data.expiry)
        ) {

            otpStore.remove(
                    normalizedEmail
            );

            return false;
        }


        // Check OTP

        return data.otp.equals(
                otp.trim()
        );
    }


    // =========================================================
    // CLEAR OTP
    // =========================================================

    public void clearOtp(
            String email
    ) {

        if (email == null) {
            return;
        }


        otpStore.remove(
                email.trim().toLowerCase()
        );
    }


    // =========================================================
    // OTP DATA
    // =========================================================

    private static class OtpData {

        private final String otp;

        private final LocalDateTime expiry;


        private OtpData(
                String otp,
                LocalDateTime expiry
        ) {

            this.otp = otp;

            this.expiry = expiry;
        }
    }
}