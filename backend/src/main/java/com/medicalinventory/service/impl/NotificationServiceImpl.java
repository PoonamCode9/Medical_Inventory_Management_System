package com.medicalinventory.service.impl;

import com.medicalinventory.entity.Notification;
import com.medicalinventory.entity.Medicine;
import com.medicalinventory.repository.MedicineRepository;
import com.medicalinventory.repository.NotificationRepository;
import com.medicalinventory.service.EmailService;
import com.medicalinventory.service.NotificationService;
import org.springframework.stereotype.Service;
import com.medicalinventory.repository.ExpiryTrackingRepository;

import com.medicalinventory.entity.UserNotification;
import com.medicalinventory.repository.UserNotificationRepository;
import com.medicalinventory.repository.UserRepository;
import java.time.LocalDate;

import com.medicalinventory.entity.User;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final ExpiryTrackingRepository expiryTrackingRepository;
    private final UserNotificationRepository userNotificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(
            MedicineRepository medicineRepository,
            NotificationRepository notificationRepository,
            EmailService emailService,
            ExpiryTrackingRepository expiryTrackingRepository,
            UserNotificationRepository userNotificationRepository,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.expiryTrackingRepository = expiryTrackingRepository;
        this.userNotificationRepository = userNotificationRepository;
        this.userRepository = userRepository;

    }

    @Override
    public void checkLowStockAndNotify(Medicine medicine) {

        if (medicine.getQuantity() > 0 &&
                medicine.getQuantity() <= 50) {

            Notification notification = new Notification();

            notification.setMessage(
                    medicine.getMedicineName()
                            + " stock is low. Available quantity: "
                            + medicine.getQuantity());

            notification.setNotificationType("LOW_STOCK");

            notification.setMedicine(medicine);

            Notification savedNotification = notificationRepository.save(notification);

            List<User> users = userRepository.findAll();

            for (User user : users) {

                UserNotification userNotification = new UserNotification();

                userNotification.setNotification(savedNotification);
                userNotification.setUser(user);
                userNotification.setIsRead(false);

                userNotificationRepository.save(userNotification);
            }

            emailService.sendLowStockAlertEmail(medicine);
        }
    }

    @Override
    public void checkExpiryAndNotify() {

        expiryTrackingRepository.findAll().forEach(expiry -> {

            LocalDate today = LocalDate.now();

            if (expiry.getExpiryDate().isBefore(today)) {

                Notification notification = new Notification();

                notification.setMessage(
                        expiry.getMedicine().getMedicineName()
                                + " has expired.");

                notification.setNotificationType("EXPIRED");

                notification.setMedicine(expiry.getMedicine());

                notificationRepository.save(notification);

            } else if (!expiry.getExpiryDate().isAfter(today.plusDays(30))) {

                Notification notification = new Notification();

                notification.setMessage(
                        expiry.getMedicine().getMedicineName()
                                + " is expiring soon.");

                notification.setNotificationType("EXPIRY_ALERT");

                notification.setMedicine(expiry.getMedicine());

                notificationRepository.save(notification);
            }

        });
    }

    @Override
    public void checkExpiryForMedicine(Medicine medicine) {

        LocalDate today = LocalDate.now();

        if (medicine.getExpiryDate().isBefore(today)) {

            Notification notification = new Notification();

            notification.setMessage(
                    medicine.getMedicineName()
                            + " has expired.");

            notification.setNotificationType("EXPIRED");

            notification.setMedicine(medicine);

            Notification savedNotification = notificationRepository.save(notification);

            List<User> users = userRepository.findAll();

            for (User user : users) {

                UserNotification userNotification = new UserNotification();

                userNotification.setNotification(savedNotification);
                userNotification.setUser(user);
                userNotification.setIsRead(false);

                userNotificationRepository.save(userNotification);
            }

            emailService.sendExpiredMedicineEmail(medicine);

        } else if (!medicine.getExpiryDate().isAfter(today.plusDays(30))) {

            Notification notification = new Notification();

            notification.setMessage(
                    medicine.getMedicineName()
                            + " is expiring soon.");

            notification.setNotificationType("EXPIRY_ALERT");

            notification.setMedicine(medicine);

            Notification savedNotification = notificationRepository.save(notification);

            List<User> users = userRepository.findAll();

            for (User user : users) {

                UserNotification userNotification = new UserNotification();

                userNotification.setNotification(savedNotification);
                userNotification.setUser(user);
                userNotification.setIsRead(false);

                userNotificationRepository.save(userNotification);
            }

            emailService.sendExpiringSoonEmail(medicine);
        }
    }

}
