package com.medistock.backend.controller;

import com.medistock.backend.dto.request.MedicineRequest;
import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.dto.response.MedicineResponse;
import com.medistock.backend.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
@Slf4j
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getAllMedicines() {
        log.info("Request received to fetch all medicines catalog");
        List<MedicineResponse> response = medicineService.getAllMedicines();
        return ResponseEntity.ok(ApiResponse.<List<MedicineResponse>>builder()
                .success(true)
                .message("Fetched medicines catalog successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<MedicineResponse>> getMedicineById(@PathVariable Integer id) {
        log.info("Request received to fetch medicine by ID: {}", id);
        MedicineResponse response = medicineService.getMedicineById(id);
        return ResponseEntity.ok(ApiResponse.<MedicineResponse>builder()
                .success(true)
                .message("Fetched medicine details successfully.")
                .data(response)
                .build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<MedicineResponse>> createMedicine(
            @Valid @RequestBody MedicineRequest request, 
            Principal principal) {
        log.info("Request received to create medicine: {}", request.getMedicineName());
        String email = principal != null ? principal.getName() : "System Admin";
        MedicineResponse response = medicineService.createMedicine(request, email);
        return ResponseEntity.ok(ApiResponse.<MedicineResponse>builder()
                .success(true)
                .message("Medicine created successfully.")
                .data(response)
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<MedicineResponse>> updateMedicine(
            @PathVariable Integer id,
            @Valid @RequestBody MedicineRequest request,
            Principal principal) {
        log.info("Request received to update medicine ID: {}", id);
        String email = principal != null ? principal.getName() : "System Admin";
        MedicineResponse response = medicineService.updateMedicine(id, request, email);
        return ResponseEntity.ok(ApiResponse.<MedicineResponse>builder()
                .success(true)
                .message("Medicine updated successfully.")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<String>> deleteMedicine(@PathVariable Integer id, java.security.Principal principal) {
        log.info("Request received to delete medicine ID: {}", id);
        String email = principal != null ? principal.getName() : "System Admin";
        medicineService.deleteMedicine(id, email);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Medicine deleted successfully.")
                .data("Medicine record deleted from system catalog.")
                .build());
    }
}
