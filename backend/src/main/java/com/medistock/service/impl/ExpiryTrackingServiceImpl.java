package com.medistock.service.impl;

import java.util.List;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import com.medistock.entity.ExpiryTracking;
import com.medistock.entity.Notification;
import com.medistock.entity.Medicine;
import com.medistock.repository.ExpiryTrackingRepository;
import com.medistock.repository.NotificationRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.service.ExpiryTrackingService;

@Service
public class ExpiryTrackingServiceImpl implements ExpiryTrackingService {

    private final ExpiryTrackingRepository expiryTrackingRepository;
    private final NotificationRepository notificationRepository;
    private final MedicineRepository medicineRepository;

    public ExpiryTrackingServiceImpl(
            ExpiryTrackingRepository expiryTrackingRepository,
            NotificationRepository notificationRepository,
            MedicineRepository medicineRepository) {

        this.expiryTrackingRepository = expiryTrackingRepository;
        this.notificationRepository = notificationRepository;
        this.medicineRepository = medicineRepository;
    }

    private String calculateStatus(String expiryDate) {

        LocalDate expiry = LocalDate.parse(expiryDate);

        long days = ChronoUnit.DAYS.between(LocalDate.now(), expiry);

        if (days < 0)
            return "Expired";
        else if (days <= 30)
            return "Expiring Soon";
        else
            return "Safe";
    }

    private void createNotification(String title, String message) {

        Notification notification = new Notification();

        notification.setTitle(title);
        notification.setMessage(message);
        notification.setDate(LocalDate.now().toString());

        notificationRepository.save(notification);
    }

    @Override
    public ExpiryTracking addExpiryTracking(ExpiryTracking expiryTracking) {

        Medicine medicine = medicineRepository
                .findById(expiryTracking.getMedicine().getId())
                .orElse(null);

        expiryTracking.setMedicine(medicine);

        expiryTracking.setStatus(
                calculateStatus(expiryTracking.getExpiryDate()));

        if (expiryTracking.getStatus().equals("Expired")) {

            createNotification(
                    "Expired Medicine",
                    medicine.getMedicineName() + " has expired.");

        } else if (expiryTracking.getStatus().equals("Expiring Soon")) {

            createNotification(
                    "Medicine Expiring Soon",
                    medicine.getMedicineName() + " is expiring soon.");
        }

        return expiryTrackingRepository.save(expiryTracking);
    }

    @Override
    public List<ExpiryTracking> getAllExpiryTracking() {
        return expiryTrackingRepository.findAll();
    }

    @Override
    public ExpiryTracking getExpiryTrackingById(Long id) {
        return expiryTrackingRepository.findById(id).orElse(null);
    }

    @Override
    public ExpiryTracking updateExpiryTracking(Long id, ExpiryTracking expiryTracking) {

        ExpiryTracking existing = expiryTrackingRepository.findById(id).orElse(null);

        if (existing != null) {

            Medicine medicine = medicineRepository
                    .findById(expiryTracking.getMedicine().getId())
                    .orElse(null);

            existing.setMedicine(medicine);
            existing.setExpiryDate(expiryTracking.getExpiryDate());

            existing.setStatus(
                    calculateStatus(expiryTracking.getExpiryDate()));

            return expiryTrackingRepository.save(existing);
        }

        return null;
    }

    @Override
    public void deleteExpiryTracking(Long id) {
        expiryTrackingRepository.deleteById(id);
    }
}