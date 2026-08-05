package com.medicalinventory.backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.dto.ExpiryAlertDTO;
import com.medicalinventory.backend.entity.ExpiryTracking;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.repository.ExpiryTrackingRepository;
import com.medicalinventory.backend.repository.InventoryRepository;

import jakarta.transaction.Transactional;

@Service
public class ExpiryAlertsService {
    private final InventoryRepository inventoryRepository;
    private final ExpiryTrackingRepository expiryTrackingRepository;

    public ExpiryAlertsService(InventoryRepository inventoryRepository,
            ExpiryTrackingRepository expiryTrackingRepository) {
        this.inventoryRepository = inventoryRepository;
        this.expiryTrackingRepository = expiryTrackingRepository;
    }

    @Transactional
    public List<ExpiryAlertDTO> getExpiryAlerts() {
        List<ExpiryTracking> list = expiryTrackingRepository.findAll();
        LocalDate today = LocalDate.now();

        for (ExpiryTracking expiry : list) {
            if (expiry.getMedicine() == null || expiry.getMedicine().getExpiryDate() == null)
                continue;

            long daysLeft = ChronoUnit.DAYS.between(today, expiry.getMedicine().getExpiryDate());

            if (daysLeft < 0) {
                expiry.setStatus("Expired");
                expiry.setRemarks("Remove immediately");
            } else if (daysLeft <= 7) {
                expiry.setStatus("Urgent");
                expiry.setRemarks("Sell first");
            } else if (daysLeft <= 30) {
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
            inventory.ifPresent(inv -> dto.setInventoryId(inv.getInventoryId()));
            return dto;
        }).toList();
    }
}