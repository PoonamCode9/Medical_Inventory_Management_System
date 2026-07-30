package com.medistock.backend.scheduler;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.medistock.backend.entity.Medicine;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final MedicineRepository medicineRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 9 * * ?")   // Every day at 9 AM
    public void checkExpiryMedicines() {

        List<Medicine> medicines = medicineRepository.findAll();

        for (Medicine medicine : medicines) {

            if (medicine.getExpiryDate() == null)
                continue;

            long daysLeft = ChronoUnit.DAYS.between(
                    LocalDate.now(),
                    medicine.getExpiryDate());

            if (daysLeft == 30) {

                notificationService.createNotification(
                        1,
                        medicine.getMedicineName()
                                + " will expire in 30 days.",
                        "EXPIRY");
            }

            else if (daysLeft == 7) {

                notificationService.createNotification(
                        1,
                        medicine.getMedicineName()
                                + " will expire in 7 days.",
                        "EXPIRY");
            }

            else if (daysLeft == 1) {

                notificationService.createNotification(
                        1,
                        medicine.getMedicineName()
                                + " will expire tomorrow.",
                        "EXPIRY");
            }

            else if (daysLeft == 0) {

                notificationService.createNotification(
                        1,
                        medicine.getMedicineName()
                                + " expires today.",
                        "EXPIRY");
            }

            else if (daysLeft < 0) {

                notificationService.createNotification(
                        1,
                        medicine.getMedicineName()
                                + " has expired.",
                        "EXPIRED");
            }
        }
    }
}