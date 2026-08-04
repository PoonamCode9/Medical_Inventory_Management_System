package com.MediStock.app.services;

import com.MediStock.app.entities.Notification;
import com.MediStock.app.entities.Role;
import com.MediStock.app.entities.User;
import com.MediStock.app.repositories.RoleRepository;
import com.MediStock.app.repositories.UserRepository;
import com.MediStock.app.utils.EmailTemplateBuilder;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            UserRepository userRepository,
            RoleRepository roleRepository
    ) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void sendInventoryAlert(List<Notification> notifications) {

        if (notifications == null || notifications.isEmpty()) {
            return;
        }

        List<String> recipients = getRecipients();

        if (recipients.isEmpty()) {
            return;
        }

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setSubject(
                    "🚨 MediStock Inventory Alert (" +
                            notifications.size() +
                            " Issues)"
            );

            helper.setText(
                    EmailTemplateBuilder.buildInventoryAlertEmail(
                            notifications
                    ),
                    true
            );

            /*
            |--------------------------------------------------------------------------
            | Send One Email
            |--------------------------------------------------------------------------
            */

            helper.setTo(recipients.get(0));

            if (recipients.size() > 1) {

                helper.setBcc(

                        recipients
                                .subList(1, recipients.size())
                                .toArray(new String[0])

                );

            }

            mailSender.send(message);

            System.out.println(
                    "\n========== EMAIL SENT =========="
            );

            System.out.println(
                    "Recipients : " + recipients.size()
            );

            System.out.println(
                    "Notifications : " + notifications.size()
            );

            System.out.println(
                    "================================\n"
            );

        } catch (Exception ex) {

            System.err.println(
                    "\n========== EMAIL FAILED =========="
            );

            System.err.println(ex.getMessage());

            System.err.println(
                    "==================================\n"
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Get Admin & Pharmacist Emails
    |--------------------------------------------------------------------------
    */

    private List<String> getRecipients() {

        List<String> emails = new ArrayList<>();

        roleRepository.findByRoleName("ADMIN")
                .ifPresent(role -> addUsers(role, emails));

        roleRepository.findByRoleName("PHARMACIST")
                .ifPresent(role -> addUsers(role, emails));

        return emails;

    }

    private void addUsers(
            Role role,
            List<String> emails
    ) {

        List<User> users =
                userRepository.findByRoleId(
                        role.getRoleId()
                );

        for (User user : users) {

            if (

                    user.getEmail() != null

                            &&

                            !user.getEmail().isBlank()

                            &&

                            !emails.contains(user.getEmail())

            ) {

                emails.add(user.getEmail());

            }

        }

    }

}