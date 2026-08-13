package com.medistock.backend.controller;

import com.medistock.backend.dto.MedicineRequest;
import com.medistock.backend.model.Medicine;
import com.medistock.backend.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = {"http://localhost:3000", "${app.frontend.url}"})
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping
    public ResponseEntity<Medicine> addMedicine(
            @RequestBody MedicineRequest request) {
        return ResponseEntity.ok(medicineService.addMedicine(request));
    }

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(
            @PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id,
            @RequestBody MedicineRequest request) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Medicine deleted successfully!");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(
            @RequestParam String name) {
        return ResponseEntity.ok(medicineService.searchByName(name));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Medicine>> getByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(medicineService.getByCategory(category));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Medicine>> getLowStock() {
        return ResponseEntity.ok(medicineService.getLowStockMedicines());
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<Medicine>> getExpiring() {
        return ResponseEntity.ok(medicineService.getExpiringMedicines());
    }

    @PutMapping("/{id}/stock")
public ResponseEntity<Medicine> updateStock(
        @PathVariable Long id,
        @RequestParam Integer quantity) {
    Medicine medicine = medicineService.getMedicineById(id);
    medicine.setQuantity(quantity);
    if (quantity == 0) medicine.setStatus("OUT_OF_STOCK");
    else if (quantity < 10) medicine.setStatus("LOW_STOCK");
    else medicine.setStatus("IN_STOCK");
    return ResponseEntity.ok(medicineService.updateMedicine(id, 
        convertToRequest(medicine)));
}

private com.medistock.backend.dto.MedicineRequest convertToRequest(
        Medicine medicine) {
    com.medistock.backend.dto.MedicineRequest request = 
        new com.medistock.backend.dto.MedicineRequest();
    request.setName(medicine.getName());
    request.setBatchNumber(medicine.getBatchNumber());
    request.setCategory(medicine.getCategory());
    request.setSupplier(medicine.getSupplier());
    request.setQuantity(medicine.getQuantity());
    request.setManufacturingDate(medicine.getManufacturingDate());
    request.setExpiryDate(medicine.getExpiryDate());
    request.setPrice(medicine.getPrice());
    return request;
}
}