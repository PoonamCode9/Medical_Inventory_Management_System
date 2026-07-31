package com.medistock.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.entity.Supplier;
import com.medistock.repository.SupplierRepository;
import com.medistock.service.SupplierService;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    @Override
    public Supplier updateSupplier(Long id, Supplier supplier) {

        Supplier existing = supplierRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setSupplierName(supplier.getSupplierName());
existing.setContactPerson(supplier.getContactPerson());
existing.setContactNumber(supplier.getContactNumber());
existing.setEmail(supplier.getEmail());
existing.setAddress(supplier.getAddress());
existing.setSuppliedMedicines(supplier.getSuppliedMedicines());
existing.setTotalPurchases(supplier.getTotalPurchases());
existing.setRating(supplier.getRating());
existing.setStatus(supplier.getStatus());

            return supplierRepository.save(existing);
        }

        return null;
    }

    @Override
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}