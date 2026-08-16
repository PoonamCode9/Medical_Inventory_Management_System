package com.medicalinventory.backend.service;

import com.medicalinventory.backend.dto.SystemSettingsDTO;
import com.medicalinventory.backend.entity.SystemSettings;
import com.medicalinventory.backend.repository.SystemSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemSettingsService {

    private final SystemSettingsRepository settingsRepository;

    public SystemSettingsService(SystemSettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @Transactional
    public SystemSettings getSettings() {
        return settingsRepository.findById(1L).orElseGet(() -> {
            SystemSettings defaultSettings = new SystemSettings();
            defaultSettings.setPharmacyName("MediStock Pharmacy");
            defaultSettings.setLicenseNumber("DL-12345678");
            defaultSettings.setLowStockThreshold(10);
            defaultSettings.setExpiryAlertDays(60);
            // Inside getSettings() default block:
            defaultSettings.setUrgentExpiryDays(7);
            return settingsRepository.save(defaultSettings);
        });
    }

    @Transactional
    public SystemSettings updateSettings(SystemSettingsDTO dto) {
        SystemSettings settings = getSettings();

        settings.setPharmacyName(dto.getPharmacyName().trim());
        settings.setLicenseNumber(dto.getLicenseNumber() != null ? dto.getLicenseNumber().trim() : null);
        settings.setContactEmail(dto.getContactEmail() != null ? dto.getContactEmail().trim() : null);
        settings.setContactPhone(dto.getContactPhone() != null ? dto.getContactPhone().trim() : null);
        settings.setAddress(dto.getAddress() != null ? dto.getAddress().trim() : null);

        if (dto.getLowStockThreshold() != null) {
            settings.setLowStockThreshold(dto.getLowStockThreshold());
        }
        if (dto.getExpiryAlertDays() != null) {
            settings.setExpiryAlertDays(dto.getExpiryAlertDays());
        }
        if (dto.getUrgentExpiryDays() != null) {
            settings.setUrgentExpiryDays(dto.getUrgentExpiryDays());
        }

        SystemSettings updated = settingsRepository.save(settings);
        return updated;
    }
}