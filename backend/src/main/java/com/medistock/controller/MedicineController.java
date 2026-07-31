package com.medistock.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.medistock.entity.Medicine;
import com.medistock.service.MedicineService;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineService.addMedicine(medicine);
    }

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public Medicine getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id,
                                   @RequestBody Medicine medicine) {
        return medicineService.updateMedicine(id, medicine);
    }

    @DeleteMapping("/{id}")
    public String deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return "Medicine deleted successfully";
    }
    @GetMapping("/count")
public long getTotalMedicines() {

    return medicineService.getTotalMedicines();

}

@GetMapping("/instock")
public long getInStockMedicines() {

    return medicineService.getInStockMedicines();

}

@GetMapping("/lowstock")
public long getLowStockMedicines() {

    return medicineService.getLowStockMedicines();

}

@GetMapping("/outofstock")
public long getOutOfStockMedicines() {

    return medicineService.getOutOfStockMedicines();

}

@GetMapping("/expired")
public long getExpiredMedicines() {

    return medicineService.getExpiredMedicines();

}

@GetMapping("/nearexpiry")
public long getNearExpiryMedicines() {

    return medicineService.getNearExpiryMedicines();

}

@GetMapping("/search")
public List<Medicine> searchMedicine(@RequestParam String keyword) {

    return medicineService.searchMedicine(keyword);

}

@GetMapping("/search/batch/{batchNumber}")
public List<Medicine> searchByBatchNumber(@PathVariable String batchNumber) {

    return medicineService.searchByBatchNumber(batchNumber);

}

@GetMapping("/search/expiry/{expiryDate}")
public List<Medicine> searchByExpiryDate(@PathVariable String expiryDate) {

    return medicineService.searchByExpiryDate(expiryDate);

}

}