package com.MediStock.app.controllers;

import com.MediStock.app.dto.SupplierRequest;
import com.MediStock.app.dto.SupplierResponse;
import com.MediStock.app.services.SupplierService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public List<SupplierResponse> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public SupplierResponse getSupplierById(@PathVariable Long supplierId) {
        return supplierService.getSupplierById(supplierId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SupplierResponse addSupplier(@RequestBody SupplierRequest request) {
        return supplierService.addSupplier(request);
    }

    @PutMapping("/{supplierId}")
    @PreAuthorize("hasRole('ADMIN')")
    public SupplierResponse updateSupplier(
            @PathVariable Long supplierId,
            @RequestBody SupplierRequest request) {

        return supplierService.updateSupplier(supplierId, request);
    }

    @DeleteMapping("/{supplierId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSupplier(@PathVariable Long supplierId) {
        supplierService.deleteSupplier(supplierId);
    }
}