package com.medistock.controller;

import com.medistock.entity.Medicine;
import com.medistock.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin("*")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine){
        return medicineService.addMedicine(medicine);
    }

    @GetMapping
    public List<Medicine> getAllMedicines(){
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public Medicine getMedicine(@PathVariable Long id){
        return medicineService.getMedicine(id);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id,
                                   @RequestBody Medicine medicine){
        return medicineService.updateMedicine(id, medicine);
    }

    @DeleteMapping("/{id}")
    public String deleteMedicine(@PathVariable Long id){
        medicineService.deleteMedicine(id);
        return "Medicine Deleted Successfully";
    }

    @GetMapping("/search")
    public List<Medicine> searchMedicine(@RequestParam String name){
        return medicineService.searchMedicine(name);
    }
    @GetMapping("/low-stock")
    public List<Medicine> getLowStockMedicines() {
        return medicineService.getLowStockMedicines();
    }

    @GetMapping("/expired")
    public List<Medicine> getExpiredMedicines() {
        return medicineService.getExpiredMedicines();
    }
    @GetMapping("/out-of-stock")
public List<Medicine> getOutOfStockMedicines() {

    return medicineService.getOutOfStockMedicines();

}
@GetMapping("/near-expiry")
public List<Medicine> getNearExpiryMedicines() {

    return medicineService.getNearExpiryMedicines();

}

}   