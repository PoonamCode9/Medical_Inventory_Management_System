package com.medicalinventory.backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.dto.ExpiryAlertDTO;
import com.medicalinventory.backend.entity.ExpiryTracking;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.SystemSettings;
import com.medicalinventory.backend.repository.ExpiryTrackingRepository;
import com.medicalinventory.backend.repository.InventoryRepository;
import com.medicalinventory.backend.repository.SystemSettingsRepository;

import jakarta.transaction.Transactional;

@Service
public class ExpiryAlertsService {
    private final InventoryRepository inventoryRepository;
    private final ExpiryTrackingRepository expiryTrackingRepository;
    private final SystemSettingsRepository systemSettingsRepository;

    public ExpiryAlertsService(
            InventoryRepository inventoryRepository,
            ExpiryTrackingRepository expiryTrackingRepository,
            SystemSettingsRepository systemSettingsRepository) {
        this.inventoryRepository = inventoryRepository;
        this.expiryTrackingRepository = expiryTrackingRepository;
        this.systemSettingsRepository = systemSettingsRepository;
    }

    @Transactional
    public List<ExpiryAlertDTO> getExpiryAlerts() {
        List<ExpiryTracking> list = expiryTrackingRepository.findAll();
        LocalDate today = LocalDate.now();

        SystemSettings settings = systemSettingsRepository.findById(1L).orElseGet(SystemSettings::new);
        int urgentDays = settings.getUrgentExpiryDays() != null ? settings.getUrgentExpiryDays() : 7;
        int expiringSoonDays = settings.getExpiryAlertDays() != null ? settings.getExpiryAlertDays() : 60;

        for (ExpiryTracking expiry : list) {
            if (expiry.getMedicine() == null || expiry.getMedicine().getExpiryDate() == null)
                continue;

            long daysLeft = ChronoUnit.DAYS.between(today, expiry.getMedicine().getExpiryDate());

            if (daysLeft < 0) {
                expiry.setStatus("Expired");
                expiry.setRemarks("Remove immediately");
            } else if (daysLeft <= urgentDays) {
                expiry.setStatus("Urgent");
                expiry.setRemarks("Sell first / Critical Alert");
            } else if (daysLeft <= expiringSoonDays) {
                expiry.setStatus("Expiring_Soon");
                expiry.setRemarks("Monitor Stock");
            } else {
                expiry.setStatus("Active");
                expiry.setRemarks("No action required");
            }
        }

        expiryTrackingRepository.saveAll(list);

        return list.stream().map(expiry -> {
            ExpiryAlertDTO dto = new ExpiryAlertDTO();
            dto.setMedicineId(expiry.getMedicine().getMedicineId());
            dto.setMedicineName(expiry.getMedicine().getMedicineName());
            dto.setBatchNo(expiry.getMedicine().getBatchNo());
            dto.setExpiryDate(expiry.getMedicine().getExpiryDate());
            dto.setStatus(expiry.getStatus());
            dto.setRemarks(expiry.getRemarks());
            dto.setDaysLeft(ChronoUnit.DAYS.between(today, expiry.getMedicine().getExpiryDate()));
            Optional<Inventory> inventory = inventoryRepository.findByMedicine(expiry.getMedicine());
            if (inventory.isPresent()) {
                dto.setInventoryId(inventory.get().getInventoryId());
                dto.setQuantity(inventory.get().getQuantity());
            } else {
                dto.setQuantity(0);
            }
            return dto;
        }).toList();
    }
}