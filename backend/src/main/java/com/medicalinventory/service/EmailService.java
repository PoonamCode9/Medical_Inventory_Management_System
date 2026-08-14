package com.medicalinventory.service;

import com.medicalinventory.entity.Medicine;

public interface EmailService {
    void sendEmail(String to, String subject, String body);

    void sendLowStockAlertEmail(Medicine medicine);

    void sendExpiredMedicineEmail(Medicine medicine);

    void sendExpiringSoonEmail(Medicine medicine);
}