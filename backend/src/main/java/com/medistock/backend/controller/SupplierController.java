package com.medistock.backend.controller;

import com.medistock.backend.model.Supplier;
import com.medistock.backend.repository.SupplierRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    @PostMapping
    public Supplier create(@Valid @RequestBody Supplier supplier) {
        supplier.setId(null);
        return supplierRepository.save(supplier);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> update(@PathVariable Long id, @Valid @RequestBody Supplier updated) {
        return supplierRepository.findById(id).map(existing -> {
            updated.setId(existing.getId());
            return ResponseEntity.ok(supplierRepository.save(updated));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
