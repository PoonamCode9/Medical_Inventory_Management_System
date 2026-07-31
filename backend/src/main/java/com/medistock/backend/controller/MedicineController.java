package com.medistock.backend.controller;

import com.medistock.backend.model.Medicine;
import com.medistock.backend.repository.MedicineRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineRepository medicineRepository;

    public MedicineController(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    @GetMapping
    public List<Medicine> getAll() {
        return medicineRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getOne(@PathVariable Long id) {
        return medicineRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Medicine create(@Valid @RequestBody Medicine medicine) {
        medicine.setId(null);
        return medicineRepository.save(medicine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> update(@PathVariable Long id, @Valid @RequestBody Medicine updated) {
        return medicineRepository.findById(id).map(existing -> {
            updated.setId(existing.getId());
            return ResponseEntity.ok(medicineRepository.save(updated));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!medicineRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        medicineRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
