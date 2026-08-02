package com.medicalinventory.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.service.MedicineService;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {
    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicineById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(medicineService.getMedicineById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> saveMedicine(@RequestBody Medicine medicine) {
        try {
            return ResponseEntity.ok(medicineService.saveMedicine(medicine));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        try {
            return ResponseEntity.ok(medicineService.updateMedicine(id, medicine));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        try {
            medicineService.deleteMedicine(id);
            return ResponseEntity.ok("Medicine deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/categories") 
    public List<String> getCategories() {
        return medicineService.getCategories();
    }

    @GetMapping("/category-chart") 
    public List<Map<String, Object>> getCategoryChart() {
        return medicineService.getCategoryChart();
    }


}
