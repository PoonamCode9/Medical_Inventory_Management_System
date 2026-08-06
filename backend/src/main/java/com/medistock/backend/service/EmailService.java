package com.medistock.backend.service;

public interface EmailService {
    void sendHtmlEmail(String to, String subject, String htmlContent);
    void sendAlertEmail(String to, String alertType, String message);
}
