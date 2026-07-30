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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.backend.dto.SupplierRequest;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.service.SupplierService;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // Get All
    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    // Get By Id
    @GetMapping("/{id}")
    public Supplier getSupplier(@PathVariable Integer id) {
        return supplierService.getSupplierById(id);
    }

    // Add Supplier
    @PostMapping
    public Supplier addSupplier(
            @RequestBody SupplierRequest dto) {

        return supplierService.addSupplier(dto);
    }

    // Update Supplier
    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable Integer id,
            @RequestBody SupplierRequest dto) {

        return supplierService.updateSupplier(id, dto);
    }

    // Delete Supplier
    @DeleteMapping("/{id}")
    public String deleteSupplier(@PathVariable Integer id) {

        supplierService.deleteSupplier(id);

        return "Supplier Deleted Successfully";
    }

    // Search Supplier
    @GetMapping("/search")
    public List<Supplier> searchSupplier(
            @RequestParam String keyword) {

        return supplierService.searchSuppliers(keyword);
    }

}