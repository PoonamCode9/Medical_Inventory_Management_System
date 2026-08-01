package com.medical.om.om_backend.service;

import com.medical.om.om_backend.entity.Inventory;
import com.medical.om.om_backend.entity.Role;
import com.medical.om.om_backend.entity.Users;
import com.medical.om.om_backend.repository.InventoryRepository;
import com.medical.om.om_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpiryService {

    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final InventoryCleanupService cleanupService;

    @Value("${app.expiry.report-days:30}")
    private int reportDays;

    public ExpiryService(InventoryRepository inventoryRepository,
                         UserRepository userRepository,
                         EmailService emailService,
                         InventoryCleanupService cleanupService) {
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.cleanupService = cleanupService;
    }

    /**
     * Returns summary counts + the full list of inventory items sorted by expiration date.
     */
    public Map<String, Object> getExpirySummary(int days) {
        cleanupService.cleanup();
        int threshold = days > 0 ? days : reportDays;
        List<Inventory> all = inventoryRepository.findAllWithExpiration();
        LocalDate today = LocalDate.now();

        List<Inventory> expired = new ArrayList<>();
        List<Inventory> critical = new ArrayList<>();
        List<Inventory> warning = new ArrayList<>();
        List<Inventory> safe = new ArrayList<>();
        long atRiskUnits = 0;

        for (Inventory i : all) {
            LocalDate exp = i.getExpiration_date();
            if (exp == null) continue;
            long daysLeft = ChronoUnit.DAYS.between(today, exp);
            if (daysLeft < 0) {
                expired.add(i);
                atRiskUnits += i.getAvailable_qty();
            } else if (daysLeft < 10) {
                critical.add(i);
                atRiskUnits += i.getAvailable_qty();
            } else if (daysLeft <= threshold) {
                warning.add(i);
                atRiskUnits += i.getAvailable_qty();
            } else {
                safe.add(i);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("expired", expired.size());
        result.put("critical", critical.size());
        result.put("warning", warning.size());
        result.put("safe", safe.size());
        result.put("atRiskUnits", atRiskUnits);
        result.put("items", all);
        return result;
    }

    /**
     * Sends the expiry report email to all ADMIN, PHARMACIST and STAFF users who have an email set.
     */
    public Map<String, Object> sendExpiryReport() {
        cleanupService.cleanup();
        List<Inventory> all = inventoryRepository.findAllWithExpiration();
        LocalDate today = LocalDate.now();

        List<Inventory> critical = new ArrayList<>();
        List<Inventory> warning = new ArrayList<>();

        for (Inventory i : all) {
            LocalDate exp = i.getExpiration_date();
            if (exp == null) continue;
            long daysLeft = ChronoUnit.DAYS.between(today, exp);
            if (daysLeft <= 10) {
                critical.add(i);
            } else if (daysLeft <= reportDays) {
                warning.add(i);
            }
        }

        List<String> recipients = new ArrayList<>();
        recipients.addAll(collectEmails(Role.ADMIN));
        recipients.addAll(collectEmails(Role.PHARMACIST));
        recipients.addAll(collectEmails(Role.STAFF));

        emailService.sendExpiryReport(recipients, critical, warning);

        Map<String, Object> result = new HashMap<>();
        result.put("sent", !recipients.isEmpty());
        result.put("recipients", recipients.size());
        result.put("criticalCount", critical.size());
        result.put("warningCount", warning.size());
        result.put("emails", recipients);
        return result;
    }

    private List<String> collectEmails(Role role) {
        return userRepository.findByRoleWithEmail(role).stream()
                .map(Users::getEmail)
                .filter(e -> e != null && !e.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }
}
