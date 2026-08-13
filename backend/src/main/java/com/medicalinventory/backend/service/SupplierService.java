package com.medicalinventory.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.entity.Supplier;
import com.medicalinventory.backend.repository.MedicineRepository;
import com.medicalinventory.backend.repository.PurchaseOrderRepository;
import com.medicalinventory.backend.repository.SupplierRepository;

import jakarta.transaction.Transactional;

@Service
public class SupplierService {
    private final SupplierRepository supplierRepository;
    public final NotificationService notificationService;
    private final MedicineRepository medicineRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public SupplierService(SupplierRepository supplierRepository, NotificationService notificationService, MedicineRepository medicineRepository, PurchaseOrderRepository purchaseOrderRepository) {
        this.supplierRepository = supplierRepository;
        this.notificationService = notificationService;
        this.medicineRepository = medicineRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
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
    @Transactional
    public Supplier saveSupplier(Supplier supplier) {
        if(supplierRepository.existsByEmail(supplier.getEmail())) {
            throw new RuntimeException("Supplier email already exists");
        }
        Supplier savedSupplier = supplierRepository.save(supplier);

        notificationService.createNotification(null, "SUPPLIER_ADDED",  savedSupplier.getSupplierName() + " supplier added successfully.", "Push");

        return savedSupplier;
    }

    // Update supplier 
    @Transactional
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

    // Delete supplier (With Proper Constraints)
    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));

        boolean hasMedicines = medicineRepository.existsBySupplier(supplier);
        if (hasMedicines) {
            throw new RuntimeException("Cannot delete supplier '" + supplier.getSupplierName() 
                + "' because active medicines are linked to it. Please reassign or delete the medicines first.");
        }

        boolean hasPendingOrders = purchaseOrderRepository.existsBySupplierAndStatusIgnoreCase(supplier, "Pending");
        if (hasPendingOrders) {
            throw new RuntimeException("Cannot delete supplier '" + supplier.getSupplierName() 
                + "' because it has active Pending Purchase Orders. Please process or cancel the orders first.");
        }

        purchaseOrderRepository.unlinkSupplierFromPurchaseOrders(supplier);

        String supplierName = supplier.getSupplierName();

        supplierRepository.delete(supplier);

        notificationService.createNotification(null, "SUPPLIER_DELETED", supplierName + " supplier deleted successfully.", "Push");
    }
    
}