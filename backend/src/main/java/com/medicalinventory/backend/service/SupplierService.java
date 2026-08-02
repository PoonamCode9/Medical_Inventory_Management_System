package com.medicalinventory.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.entity.Supplier;
import com.medicalinventory.backend.repository.SupplierRepository;

@Service
public class SupplierService {
    private final SupplierRepository supplierRepository;
    public final NotificationService notificationService;

    public SupplierService(SupplierRepository supplierRepository, NotificationService notificationService) {
        this.supplierRepository = supplierRepository;
        this.notificationService = notificationService;
    }

    // Get all suppliers
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Get supplier by ID
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    // Add supplier (save)
    public Supplier saveSupplier(Supplier supplier) {
        if(supplierRepository.existsByEmail(supplier.getEmail())) {
            throw new RuntimeException("Supplier email already exists");
        }
        Supplier savedSupplier = supplierRepository.save(supplier);

        notificationService.createNotification(null, "SUPPLIER_ADDED",  savedSupplier.getSupplierName() + " supplier added successfully.", "Push");

        return savedSupplier;
    }

    // Update supplier 
    public Supplier updateSupplier(Long id, Supplier supplier) {
        Supplier existingSupplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));

        Supplier emailSupplier = supplierRepository.findByEmail(supplier.getEmail()).orElse(null);
        if(emailSupplier != null && !emailSupplier.getSupplierId().equals(id)) {
            throw new RuntimeException("Supplier email already exists");
        }
            
        existingSupplier.setSupplierName(supplier.getSupplierName());
        existingSupplier.setContactPerson(supplier.getContactPerson());
        existingSupplier.setPhone(supplier.getPhone());
        existingSupplier.setEmail(supplier.getEmail());
        existingSupplier.setAddress(supplier.getAddress());

        Supplier updatedSupplier = supplierRepository.save(existingSupplier);

        notificationService.createNotification(null, "SUPPLIER_UPDATED",  updatedSupplier.getSupplierName() + " supplier updated successfully.", "Push");

        return updatedSupplier;
    }

    // Delete supplier
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));

        String supplierName = supplier.getSupplierName();

        supplierRepository.delete(supplier);

        notificationService.createNotification(null, "SUPPLIER_DELETED",  supplierName + " supplier deleted successfully.", "Push");
    }
    
}