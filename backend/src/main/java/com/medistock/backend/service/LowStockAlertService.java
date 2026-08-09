package com.medistock.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.medistock.backend.entity.Inventory;

@Service
public class LowStockAlertService {

    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;

    @Value("${admin.email}")
    private String adminEmail;

    public LowStockAlertService(
            EmailService emailService,
            EmailTemplateService emailTemplateService) {

        this.emailService = emailService;
        this.emailTemplateService = emailTemplateService;
    }

    public void checkLowStock(Inventory inventory) {

        if (inventory.getQuantityAvailable() <= inventory.getMinimumStock()) {

            String body = """
            <p>Hello <b>Admin</b>,</p>

            <p style="color:red;font-size:16px;">
            ⚠ A medicine has reached the minimum stock level.
            </p>

            <table style="width:100%%;border-collapse:collapse;border:1px solid #ddd;">

            <tr style="background:#f5f5f5;">
                <td style="padding:10px;"><b>Medicine</b></td>
                <td style="padding:10px;">%s</td>
            </tr>

            <tr>
                <td style="padding:10px;"><b>Current Stock</b></td>
                <td style="padding:10px;color:red;"><b>%d</b></td>
            </tr>

            <tr style="background:#f5f5f5;">
                <td style="padding:10px;"><b>Minimum Stock</b></td>
                <td style="padding:10px;">%d</td>
            </tr>

            </table>

            <br>

            <p>
            Please create a purchase order immediately to avoid stock shortage.
            </p>

            <p>
            Regards,<br>
            <b>MediStock Inventory System</b>
            </p>
            """
            .formatted(
                    inventory.getMedicine().getMedicineName(),
                    inventory.getQuantityAvailable(),
                    inventory.getMinimumStock()
            );

            emailService.sendEmail(
                    adminEmail,
                    "⚠ Low Stock Alert - MediStock",
                    emailTemplateService.buildTemplate(
                            "Low Stock Alert",
                            body
                    )
            );
        }
    }
}