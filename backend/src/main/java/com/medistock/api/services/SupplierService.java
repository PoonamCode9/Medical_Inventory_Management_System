package com.medistock.api.services;

import com.medistock.api.dto.SupplierRequest;
import com.medistock.api.models.Supplier;
import com.medistock.api.repositories.MedicineRepository;
import com.medistock.api.repositories.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;

    public SupplierService(SupplierRepository supplierRepository, MedicineRepository medicineRepository) {
        this.supplierRepository = supplierRepository;
        this.medicineRepository = medicineRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    @Transactional
    public Supplier createSupplier(SupplierRequest request) {
        if (supplierRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Supplier with email '" + request.getEmail() + "' already exists");
        }
        Supplier supplier = new Supplier(
                request.getName(),
                request.getContactNumber(),
                request.getEmail(),
                request.getAddress()
        );
        return supplierRepository.save(supplier);
    }

    @Transactional
    public Supplier updateSupplier(Long id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        if (supplierRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new RuntimeException("Supplier with email '" + request.getEmail() + "' already exists");
        }

        supplier.setName(request.getName());
        supplier.setContactNumber(request.getContactNumber());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        return supplierRepository.save(supplier);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        // Unlink medicines referencing this supplier before deleting
        medicineRepository.findAll().stream()
                .filter(m -> m.getSupplier() != null && id.equals(m.getSupplier().getId()))
                .forEach(m -> {
                    m.setSupplier(null);
                    medicineRepository.save(m);
                });
        supplierRepository.deleteById(id);
    }
}
