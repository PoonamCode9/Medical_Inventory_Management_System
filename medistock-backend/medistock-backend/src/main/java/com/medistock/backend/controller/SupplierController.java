package com.medistock.backend.controller;

import com.medistock.backend.entity.Supplier;
import com.medistock.backend.repository.SupplierRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {


    private final SupplierRepository supplierRepository;


    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }


    // Get all suppliers
    @GetMapping
    public List<Supplier> getAllSuppliers() {

        return supplierRepository.findAll();

    }


    // Add supplier
    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {

        return supplierRepository.save(supplier);

    }


    // Delete supplier
    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {

        supplierRepository.deleteById(id);

    }


    // Update supplier
    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable Long id,
            @RequestBody Supplier supplier
    ){

        supplier.setId(id);

        return supplierRepository.save(supplier);

    }

}