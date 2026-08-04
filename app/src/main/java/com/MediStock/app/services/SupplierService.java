package com.MediStock.app.services;

import com.MediStock.app.dto.SupplierRequest;
import com.MediStock.app.dto.SupplierResponse;
import com.MediStock.app.entities.Supplier;
import com.MediStock.app.repositories.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SupplierResponse getSupplierById(Long supplierId) {

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        return toResponse(supplier);
    }

    public SupplierResponse addSupplier(SupplierRequest request) {

        Supplier supplier = toEntity(request);

        Supplier savedSupplier = supplierRepository.save(supplier);

        return toResponse(savedSupplier);
    }

    public SupplierResponse updateSupplier(Long supplierId, SupplierRequest request) {

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.setName(request.getName());
        supplier.setPhNo(request.getPhNo());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());

        Supplier updatedSupplier = supplierRepository.save(supplier);

        return toResponse(updatedSupplier);
    }

    public void deleteSupplier(Long supplierId) {

        if (!supplierRepository.existsById(supplierId)) {
            throw new RuntimeException("Supplier not found");
        }

        supplierRepository.deleteById(supplierId);
    }

    // ---------------- Mapping Methods ----------------

    private Supplier toEntity(SupplierRequest request) {

        Supplier supplier = new Supplier();

        supplier.setName(request.getName());
        supplier.setPhNo(request.getPhNo());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());

        return supplier;
    }

    private SupplierResponse toResponse(Supplier supplier) {

        SupplierResponse response = new SupplierResponse();

        response.setSupplierId(supplier.getSupplierId());
        response.setName(supplier.getName());
        response.setPhNo(supplier.getPhNo());
        response.setEmail(supplier.getEmail());
        response.setAddress(supplier.getAddress());

        return response;
    }
}