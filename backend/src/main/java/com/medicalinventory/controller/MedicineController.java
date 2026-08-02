package com.medicalinventory.controller;

import com.medicalinventory.entity.Medicine;
import com.medicalinventory.service.MedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @PostMapping
    public ResponseEntity<Medicine> addMedicine(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.addMedicine(medicine));
    }

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id,
            @RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, medicine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Long id) {
        try {
            medicineService.deleteMedicine(id);
            return ResponseEntity.ok("Medicine deleted successfully");

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getMedicineCount() {
        return ResponseEntity.ok(medicineService.getMedicineCount());
    }

    @PutMapping("/{id}/stock-in/{quantity}")
    public ResponseEntity<Medicine> stockIn(@PathVariable Long id,
            @PathVariable Integer quantity) {
        return ResponseEntity.ok(medicineService.stockIn(id, quantity));
    }

    @PutMapping("/{id}/stock-out/{quantity}")
    public ResponseEntity<Medicine> stockOut(@PathVariable Long id,
            @PathVariable Integer quantity) {
        return ResponseEntity.ok(medicineService.stockOut(id, quantity));
    }
}