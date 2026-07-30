package com.medistock.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.backend.dto.MedicineRequestdto;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.service.MedicineService;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    // @PostMapping
    // public Medicine addMedicine(@RequestBody MedicineRequestdto dto) {
    //     return medicineService.addMedicine(dto);
    // }

    @PostMapping
public Medicine addMedicine(@RequestBody MedicineRequestdto dto) {

    System.out.println("POST /api/medicines called");

    return medicineService.addMedicine(dto);
}
@PutMapping("/{id}")
public Medicine updateMedicine(
        @PathVariable Integer id,
        @RequestBody MedicineRequestdto dto) {

    return medicineService.updateMedicine(id, dto);
}
@DeleteMapping("/{id}")
public String deleteMedicine(@PathVariable Integer id) {

    System.out.println("DELETE endpoint reached!");

    medicineService.deleteMedicine(id);

    return "Medicine deleted successfully";
}
}
