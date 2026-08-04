package com.MediStock.app.controllers;

import com.MediStock.app.dto.MedicineRequest;
import com.MediStock.app.dto.MedicineResponse;
import com.MediStock.app.services.MedicineService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public List<MedicineResponse> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{medicineId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public MedicineResponse getMedicineById(@PathVariable Long medicineId) {
        return medicineService.getMedicineById(medicineId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public MedicineResponse addMedicine(@RequestBody MedicineRequest request) {
        return medicineService.addMedicine(request);
    }

    @PutMapping("/{medicineId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public MedicineResponse updateMedicine(@PathVariable Long medicineId,
                                           @RequestBody MedicineRequest request) {
        return medicineService.updateMedicine(medicineId, request);
    }

    @DeleteMapping("/{medicineId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public void deleteMedicine(@PathVariable Long medicineId) {
        medicineService.deleteMedicine(medicineId);
    }
}