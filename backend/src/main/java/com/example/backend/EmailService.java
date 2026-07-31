package com.example.backend;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

/**
 * Core email sending service.
 * Handles sending HTML emails using Thymeleaf templates via JavaMailSender.
 * All send operations are async to avoid blocking the main flow.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${app.email.from-address}")
    private String fromAddress;

    @Value("${app.email.from-name}")
    private String fromName;

    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    /**
     * Send an HTML email using a Thymeleaf template.
     *
     * @param to           Recipient email address
     * @param subject      Email subject line
     * @param templateName Name of the Thymeleaf template (without .html extension)
     * @param templateVariables Map of variables to pass to the template
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String templateName,
                              Map<String, Object> templateVariables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);

            // Process Thymeleaf template
            Context context = new Context();
            context.setVariables(templateVariables);
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", to, e.getMessage());
        }
    }
}
