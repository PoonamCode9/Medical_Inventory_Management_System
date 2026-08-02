package com.medicalinventory.controller;

import com.medicalinventory.entity.ExpiryTracking;
import com.medicalinventory.repository.ExpiryTrackingRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/expiry-tracking")
@CrossOrigin
public class ExpiryTrackingController {

    private final ExpiryTrackingRepository expiryTrackingRepository;

    public ExpiryTrackingController(
            ExpiryTrackingRepository expiryTrackingRepository) {
        this.expiryTrackingRepository = expiryTrackingRepository;
    }

    @GetMapping
    public List<ExpiryTracking> getAllExpiryTracking() {

        // Get all expiry tracking records
        List<ExpiryTracking> expiryTrackingList = expiryTrackingRepository.findAll();

        // Get today's date
        LocalDate today = LocalDate.now();

        // Calculate the date 30 days from today
        LocalDate expiringSoonDate = today.plusDays(30);

        // Check the expiry status of each medicine
        for (ExpiryTracking expiryTracking : expiryTrackingList) {

            LocalDate expiryDate = expiryTracking.getExpiryDate();

            if (expiryDate.isBefore(today)) {

                // Medicine has already expired
                expiryTracking.setStatus("EXPIRED");

            } else if (!expiryDate.isAfter(expiringSoonDate)) {

                // Medicine will expire within the next 30 days
                expiryTracking.setStatus("EXPIRING_SOON");

            } else {

                // Medicine is valid and expires after 30 days
                expiryTracking.setStatus("VALID");
            }

            // Save the updated status in PostgreSQL
            expiryTrackingRepository.save(expiryTracking);
        }

        return expiryTrackingList;
    }

    @GetMapping("/summary")
    public Map<String, Long> getExpirySummary() {

        List<ExpiryTracking> expiryTrackingList = getAllExpiryTracking();

        long expiredCount = expiryTrackingList.stream()
                .filter(e -> "EXPIRED".equals(e.getStatus()))
                .count();

        long expiringSoonCount = expiryTrackingList.stream()
                .filter(e -> "EXPIRING_SOON".equals(e.getStatus()))
                .count();

        long validCount = expiryTrackingList.stream()
                .filter(e -> "VALID".equals(e.getStatus()))
                .count();

        Map<String, Long> summary = new HashMap<>();

        summary.put("expired", expiredCount);
        summary.put("expiringSoon", expiringSoonCount);
        summary.put("valid", validCount);

        return summary;
    }

    @GetMapping("/expired")
    public List<ExpiryTracking> getExpiredMedicines() {
        return getAllExpiryTracking().stream()
                .filter(e -> "EXPIRED".equals(e.getStatus()))
                .toList();
    }

    @GetMapping("/expiring-soon")
    public List<ExpiryTracking> getExpiringSoonMedicines() {
        return getAllExpiryTracking().stream()
                .filter(e -> "EXPIRING_SOON".equals(e.getStatus()))
                .toList();
    }

    @GetMapping("/valid")
    public List<ExpiryTracking> getValidMedicines() {
        return getAllExpiryTracking().stream()
                .filter(e -> "VALID".equals(e.getStatus()))
                .toList();
    }
}