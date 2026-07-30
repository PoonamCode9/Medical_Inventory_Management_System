package com.medistock.backend.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.medistock.backend.entity.Medicine;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExpiryScheduler {

    private final MedicineRepository medicineRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at 12:00 AM
    public void checkExpiryMedicines() {

        LocalDate today = LocalDate.now();

        LocalDate next30Days = today.plusDays(30);

        // Medicines expiring in next 30 days
        List<Medicine> expiringSoon =
                medicineRepository.findByExpiryDateBetween(today, next30Days);

        for (Medicine medicine : expiringSoon) {

            String message = medicine.getMedicineName()
        + " will expire on "
        + medicine.getExpiryDate();

if (!notificationRepository.existsByUser_UserIdAndMessage(1, message)) {

    notificationService.createNotification(
            1,
            message,
            "EXPIRY"
    );
}
        }

        // Already expired medicines
        List<Medicine> expired =
                medicineRepository.findByExpiryDateBefore(today);

        for (Medicine medicine : expired) {
String message = medicine.getMedicineName()
        + " has expired.";

if (!notificationRepository.existsByUser_UserIdAndMessage(1, message)) {

    notificationService.createNotification(
            1,
            message,
            "EXPIRED"
    );
}
        }
    }
}