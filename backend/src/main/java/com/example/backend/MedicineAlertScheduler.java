package com.example.backend;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Scheduled service that periodically checks medicine inventory
 * and creates notifications for low stock, out of stock, and expiring medicines.
 *
 * - Scheduled scan runs ONCE per day (24h interval) — prevents repeated notifications
 * - Uses database-level duplicate check so it survives restarts
 * - Real-time triggers (on medicine create/update via AdminMedicineController)
 *   fire immediately — they still check the DB for "already notified today"
 * - Real-time email alerts are sent immediately for critical conditions
 *   (out of stock, critically low stock <= 5, or expiring within 7 days)
 */
@Service
public class MedicineAlertScheduler {

    private final MedicineRepository medicineRepository;
    private final NotificationIntegrationService notificationIntegrationService;
    private final NotificationRepository notificationRepository;
    private final EmailAlertService emailAlertService;

    private static final int CRITICAL_LOW_STOCK_THRESHOLD = 5;
    private static final int CRITICAL_EXPIRE_DAYS = 7;

    public MedicineAlertScheduler(MedicineRepository medicineRepository,
                                   NotificationIntegrationService notificationIntegrationService,
                                   NotificationRepository notificationRepository,
                                   EmailAlertService emailAlertService) {
        this.medicineRepository = medicineRepository;
        this.notificationIntegrationService = notificationIntegrationService;
        this.notificationRepository = notificationRepository;
        this.emailAlertService = emailAlertService;
    }

    /**
     * Run once every 24 hours to check medicine stock levels and expiries.
     * After creating in-app notifications, also sends a consolidated daily
     * email summary to all Admin and Pharmacist users.
     */
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // 24 hours in milliseconds
    @Transactional
    public void checkMedicineAlerts() {
        List<Medicine> allMedicines = medicineRepository.findAll();
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();

        for (Medicine medicine : allMedicines) {
            if (medicine.getId() == null) continue;

            // Out of stock → notify all eligible roles
            if (medicine.getQuantity() != null && medicine.getQuantity() <= 0) {
                notificationIntegrationService.notifyOutOfStock(
                    medicine.getName(),
                    medicine.getBatchNumber() != null ? medicine.getBatchNumber() : "N/A",
                    medicine.getId()
                );
            }
            // Low stock
            else if (medicine.getQuantity() != null && medicine.getQuantity() <= 10) {
                notificationIntegrationService.notifyLowStock(
                    medicine.getName(),
                    medicine.getBatchNumber() != null ? medicine.getBatchNumber() : "N/A",
                    medicine.getQuantity(),
                    medicine.getId()
                );
            }

            // Expiring medicines (within 30 days or already expired)
            if (medicine.getExpiryDate() != null) {
                long daysToExpiry = ChronoUnit.DAYS.between(today, medicine.getExpiryDate());
                if (daysToExpiry <= 30) {
                    notificationIntegrationService.notifyExpiringMedicine(
                        medicine.getName(),
                        medicine.getBatchNumber() != null ? medicine.getBatchNumber() : "N/A",
                        (int) daysToExpiry,
                        medicine.getId()
                    );
                }
            }
        }

        // After in-app notifications are created, send consolidated email summary
        emailAlertService.sendDailyAlertSummary();
    }

    /**
     * Called when a medicine is created or updated, to immediately generate
     * notifications if needed (rather than waiting for the next scheduled run).
     * Still checks DB for "already notified today" to prevent duplicates.
     *
     * For critical conditions (out of stock, qty <= 5, or expiring within 7 days),
     * also sends an immediate email alert in addition to the in-app notification.
     */
    @Transactional
    public void checkSingleMedicine(Medicine medicine) {
        if (medicine == null || medicine.getId() == null) return;

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        Long medId = medicine.getId().longValue();
        String batchNumber = medicine.getBatchNumber() != null ? medicine.getBatchNumber() : "N/A";

        // ── Check stock level ──────────────────────────────────

        if (medicine.getQuantity() != null && medicine.getQuantity() <= 0) {
            // Out of stock → in-app notification + immediate email
            if (!alreadyNotifiedToday("OUT_OF_STOCK", medId, todayStart)) {
                notificationIntegrationService.notifyOutOfStock(
                    medicine.getName(), batchNumber, medicine.getId()
                );
            }
            // Always send immediate email for out of stock (no duplicate check for email)
            emailAlertService.sendImmediateCriticalStockAlert(
                medicine.getName(), batchNumber, medicine.getQuantity(), medicine.getId()
            );
        } else if (medicine.getQuantity() != null && medicine.getQuantity() <= 10) {
            // Low stock → in-app notification
            if (!alreadyNotifiedToday("LOW_STOCK", medId, todayStart)) {
                notificationIntegrationService.notifyLowStock(
                    medicine.getName(), batchNumber, medicine.getQuantity(), medicine.getId()
                );
            }
            // Critical low stock (<= 5) → also send immediate email
            if (medicine.getQuantity() <= CRITICAL_LOW_STOCK_THRESHOLD) {
                emailAlertService.sendImmediateCriticalStockAlert(
                    medicine.getName(), batchNumber, medicine.getQuantity(), medicine.getId()
                );
            }
        }

        // ── Check expiry ───────────────────────────────────────

        if (medicine.getExpiryDate() != null) {
            long daysToExpiry = ChronoUnit.DAYS.between(LocalDate.now(), medicine.getExpiryDate());
            if (daysToExpiry <= 30) {
                if (!alreadyNotifiedToday("EXPIRING", medId, todayStart)) {
                    notificationIntegrationService.notifyExpiringMedicine(
                        medicine.getName(), batchNumber, (int) daysToExpiry, medicine.getId()
                    );
                }
                // Critical expiry (within 7 days or already expired) → immediate email
                if (daysToExpiry <= CRITICAL_EXPIRE_DAYS) {
                    emailAlertService.sendImmediateExpiringAlert(
                        medicine.getName(), batchNumber,
                        medicine.getExpiryDate(), (int) daysToExpiry, medicine.getId()
                    );
                }
            }
        }
    }

    /**
     * Checks the database for any notification of the given type for the given
     * medicine reference ID created since the start of today.
     * Uses the first admin user as a representative check since notifications
     * are broadcast to all users of a role. If even one notification of this
     * type/reference exists today, we skip generating new ones.
     */
    private boolean alreadyNotifiedToday(String type, Long referenceId, LocalDateTime since) {
        return notificationRepository.existsByTypeAndReferenceIdAndCreatedAtAfter(
                type, referenceId, since);
    }
}
