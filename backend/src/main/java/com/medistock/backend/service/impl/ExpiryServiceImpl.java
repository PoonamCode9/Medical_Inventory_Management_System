package com.medistock.backend.service.impl;

import com.medistock.backend.dto.response.ExpiryAlertResponse;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.Notification;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.service.ExpiryService;
import com.medistock.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpiryServiceImpl implements ExpiryService {

    private final MedicineRepository medicineRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public List<ExpiryAlertResponse> getExpiryAlerts() {
        LocalDate today = LocalDate.now();
        List<Medicine> medicines = medicineRepository.findAll();

        // Query existing notifications to avoid duplicate spamming
        List<Notification> existingNotifications = notificationRepository.findAll();

        List<ExpiryAlertResponse> alerts = medicines.stream()
                .map(med -> {
                    LocalDate exp = med.getExpiryDate();
                    if (exp == null) return null;
                    long days = ChronoUnit.DAYS.between(today, exp);
                    String status;
                    String severity = null;
                    String notifTitle = null;
                    String notifMsg = null;

                    if (days < 0) {
                        status = "Expired";
                        severity = "DANGER";
                        notifTitle = "Medicine Expired";
                        notifMsg = "Medicine \"" + med.getMedicineName() + "\" (Batch: " + med.getBatchNumber() + ") expired on " + exp;
                    } else if (days <= 30) {
                        status = "Critical";
                        severity = "DANGER";
                        notifTitle = "Critical Expiry Warning";
                        notifMsg = "Medicine \"" + med.getMedicineName() + "\" (Batch: " + med.getBatchNumber() + ") expires in " + days + " days (Critical).";
                    } else if (days <= 60) {
                        status = "Expiring Soon";
                        severity = "WARNING";
                        notifTitle = "Batch Expiring Soon";
                        notifMsg = "Medicine \"" + med.getMedicineName() + "\" (Batch: " + med.getBatchNumber() + ") expires in " + days + " days (Expiring Soon).";
                    } else {
                        status = "Safe";
                    }

                    ExpiryAlertResponse alert = ExpiryAlertResponse.builder()
                            .medicineId(med.getMedicineId())
                            .medicineName(med.getMedicineName())
                            .batchNumber(med.getBatchNumber())
                            .expiryDate(exp)
                            .daysRemaining(days)
                            .status(status)
                            .build();

                    if (severity != null) {
                        final Integer medId = med.getMedicineId();
                        final String newMsg = notifMsg;
                        final String newTitle = notifTitle;
                        final String newPriority = ("Expired".equalsIgnoreCase(status) || "Critical".equalsIgnoreCase(status)) ? "HIGH" : "MEDIUM";
                        final String newType = "Expired".equalsIgnoreCase(status) ? "EXPIRED" : "EXPIRY_ALERT";

                        Notification existing = existingNotifications.stream()
                                .filter(n -> "EXPIRY".equalsIgnoreCase(n.getRelatedModule()) && medId.equals(n.getRelatedEntityId()))
                                .findFirst()
                                .orElse(null);

                        if (existing != null) {
                            if (!newMsg.equals(existing.getMessage())) {
                                existing.setMessage(newMsg);
                                existing.setTitle(newTitle);
                                existing.setPriority(newPriority);
                                existing.setType(newType);
                                existing.setCreatedAt(java.time.LocalDateTime.now());
                                existing.setIsRead(false);
                                notificationRepository.save(existing);
                            }
                        } else {
                            notificationService.createNotification(null, newTitle, newMsg, newType, newPriority, "EXPIRY", medId);
                        }
                    }

                    return alert;
                })
                .filter(alert -> alert != null)
                .collect(Collectors.toList());

        return alerts;
    }

    @Override
    public List<ExpiryAlertResponse> getExpiredMedicines() {
        return getExpiryAlerts().stream()
                .filter(a -> "Expired".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpiryAlertResponse> getCriticalMedicines() {
        return getExpiryAlerts().stream()
                .filter(a -> "Critical".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpiryAlertResponse> getExpiringMedicines() {
        return getExpiryAlerts().stream()
                .filter(a -> "Expiring Soon".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpiryAlertResponse> getSafeMedicines() {
        return getExpiryAlerts().stream()
                .filter(a -> "Safe".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public java.util.Map<String, Long> getExpirySummary() {
        List<ExpiryAlertResponse> alerts = getExpiryAlerts();
        java.util.Map<String, Long> summary = new java.util.HashMap<>();
        summary.put("total", (long) alerts.size());
        summary.put("expired", alerts.stream().filter(a -> "Expired".equalsIgnoreCase(a.getStatus())).count());
        summary.put("critical", alerts.stream().filter(a -> "Critical".equalsIgnoreCase(a.getStatus())).count());
        summary.put("expiring", alerts.stream().filter(a -> "Expiring Soon".equalsIgnoreCase(a.getStatus())).count());
        summary.put("safe", alerts.stream().filter(a -> "Safe".equalsIgnoreCase(a.getStatus())).count());
        return summary;
    }
}
