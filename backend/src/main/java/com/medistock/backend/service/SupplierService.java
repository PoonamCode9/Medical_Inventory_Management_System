package com.medistock.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.SupplierRequest;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.repository.SupplierRepository;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // Get All Suppliers
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Get Supplier By Id
    public Supplier getSupplierById(Integer id) {

        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier Not Found"));

    }

    // Add Supplier
    public Supplier addSupplier(SupplierRequest dto) {

        Supplier supplier = new Supplier();

        supplier.setSupplierName(dto.getSupplierName());
        supplier.setContactNumber(dto.getContactNumber());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
        supplier.setCreatedAt(LocalDateTime.now());

        return supplierRepository.save(supplier);
    }

    // Update Supplier
    public Supplier updateSupplier(Integer id, SupplierRequest dto) {

        Supplier supplier = getSupplierById(id);

        supplier.setSupplierName(dto.getSupplierName());
        supplier.setContactNumber(dto.getContactNumber());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());

        return supplierRepository.save(supplier);
    }

    // Delete Supplier
    public void deleteSupplier(Integer id) {

        Supplier supplier = getSupplierById(id);

        supplierRepository.delete(supplier);
    }

    // Search Suppliers
    public List<Supplier> searchSuppliers(String keyword) {

        return supplierRepository
                .findBySupplierNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrContactNumberContaining(
                        keyword,
                        keyword,
                        keyword
                );

    }

}