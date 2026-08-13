package com.medistock.service.impl;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.medistock.entity.Inventory;
import com.medistock.entity.Notification;
import com.medistock.repository.InventoryRepository;
import com.medistock.repository.NotificationRepository;
import com.medistock.service.EmailService;
import com.medistock.service.NotificationService;
import com.medistock.entity.Medicine;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import com.medistock.repository.MedicineRepository;
@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final InventoryRepository inventoryRepository;
    private final MedicineRepository medicineRepository;
    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            EmailService emailService,
            InventoryRepository inventoryRepository,
            MedicineRepository medicineRepository) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.inventoryRepository = inventoryRepository;
         this.medicineRepository = medicineRepository;
    }
    @Override
    public Notification addNotification(Notification notification) {
        // Save notification in database
        Notification savedNotification =
                notificationRepository.save(notification);
        // Send email
        emailService.sendEmail(
                notification.getRecipientEmail(),
                notification.getTitle(),
                notification.getMessage()
        );
        return savedNotification;
    }
    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
    @Override
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }
    @Override
    public Notification updateNotification(
            Long id,
            Notification notification) {
        Notification existing =
                notificationRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(notification.getTitle());
            existing.setMessage(notification.getMessage());
            existing.setDate(notification.getDate());
            existing.setRecipientEmail(
                    notification.getRecipientEmail()
            );
            return notificationRepository.save(existing);
        }
        return null;
    }
    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
    // Automatically check low stock every 1 minute
    @Override
@Scheduled(fixedRate = 60000)
public void checkLowStock() {
    List<Inventory> inventories =
            inventoryRepository.findAll();
    for (Inventory inventory : inventories) {
        if (inventory.getAvailableStock()
                <= inventory.getMinimumStock()) {
            String medicineName =
                    inventory.getMedicine().getMedicineName();
            String title = "Low Stock Alert";
            String message =
                    medicineName
                    + " stock is low. Current quantity: "
                    + inventory.getAvailableStock();
            // Check whether this alert was already created
            boolean alreadyExists =
                    notificationRepository.existsByTitleAndMessage(
                            title,
                            message
                    );
            // Send only if this is a new alert
            if (!alreadyExists) {
                Notification notification =
                        new Notification();
                notification.setTitle(title);
                notification.setMessage(message);
                notification.setDate(
                        java.time.LocalDate.now().toString()
                );
                notification.setRecipientEmail(
                        "chintapushpitharam@gmail.com"
                );
                // Save notification + send email
                addNotification(notification);
            }
        }
    }
}
@Override
@Scheduled(fixedRate = 60000)
public void checkExpiry() {
    List<Medicine> medicines =
            medicineRepository.findAll();
    LocalDate today = LocalDate.now();
    DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");
    for (Medicine medicine : medicines) {
        try {
            LocalDate expiryDate =
                    LocalDate.parse(
                            medicine.getExpiryDate(),
                            formatter
                    );
            long daysRemaining =
                    ChronoUnit.DAYS.between(
                            today,
                            expiryDate
                    );
            // Alert when medicine expires within 30 days
            if (daysRemaining >= 0
                    && daysRemaining <= 30) {
                String title =
                        "Medicine Expiry Alert";
                String message =
                        medicine.getMedicineName()
                        + " will expire soon. Expiry date: "
                        + medicine.getExpiryDate();
                boolean alreadyExists =
                        notificationRepository
                                .existsByTitleAndMessage(
                                        title,
                                        message
                                );
                if (!alreadyExists) {
                    Notification notification =
                            new Notification();
                    notification.setTitle(title);
                    notification.setMessage(message);
                    notification.setDate(
                            today.toString()
                    );
                    notification.setRecipientEmail(
                            "chintapushpitharam@gmail.com"
                    );
                    addNotification(notification);
                }
            }
        } catch (Exception e) {
            System.out.println(
                    "Invalid expiry date for medicine: "
                    + medicine.getMedicineName()
            );
        }
    }
}
}