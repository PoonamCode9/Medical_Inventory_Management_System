package com.medicalinventory.backend.controller;

import com.medicalinventory.backend.dto.SystemSettingsDTO;
import com.medicalinventory.backend.entity.SystemSettings;
import com.medicalinventory.backend.service.SystemSettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SystemSettingsController {

    private final SystemSettingsService settingsService;

    public SystemSettingsController(SystemSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<SystemSettings> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<SystemSettings> updateSettings(@Valid @RequestBody SystemSettingsDTO dto) {
        return ResponseEntity.ok(settingsService.updateSettings(dto));
    }
}