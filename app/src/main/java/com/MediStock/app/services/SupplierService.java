package com.MediStock.app.services;

import com.MediStock.app.dto.SupplierRequest;
import com.MediStock.app.dto.SupplierResponse;
import com.MediStock.app.entities.Supplier;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import com.MediStock.app.repositories.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    private final ActivityLogService activityLogService;

    public SupplierService(

            SupplierRepository supplierRepository,

            ActivityLogService activityLogService

    ) {

        this.supplierRepository = supplierRepository;

        this.activityLogService = activityLogService;

    }

    public List<SupplierResponse> getAllSuppliers() {

        return supplierRepository.findAll()

                .stream()

                .map(this::toResponse)

                .collect(Collectors.toList());

    }

    public SupplierResponse getSupplierById(Long supplierId) {

        Supplier supplier = supplierRepository.findById(supplierId)

                .orElseThrow(() ->

                        new RuntimeException("Supplier not found"));

        return toResponse(supplier);

    }

    public SupplierResponse addSupplier(SupplierRequest request) {

        Supplier supplier = toEntity(request);

        Supplier savedSupplier = supplierRepository.save(supplier);

        activityLogService.logActivity(

                ActivityModule.SUPPLIER,

                ActivityAction.CREATED,

                savedSupplier.getSupplierId(),

                savedSupplier.getName(),

                "Added supplier: " +

                        savedSupplier.getName()

        );

        return toResponse(savedSupplier);

    }

    public SupplierResponse updateSupplier(

            Long supplierId,

            SupplierRequest request

    ) {

        Supplier supplier = supplierRepository.findById(supplierId)

                .orElseThrow(() ->

                        new RuntimeException("Supplier not found"));

        supplier.setName(request.getName());

        supplier.setPhNo(request.getPhNo());

        supplier.setEmail(request.getEmail());

        supplier.setAddress(request.getAddress());

        Supplier updatedSupplier =

                supplierRepository.save(supplier);

        activityLogService.logActivity(

                ActivityModule.SUPPLIER,

                ActivityAction.UPDATED,

                updatedSupplier.getSupplierId(),

                updatedSupplier.getName(),

                "Updated supplier: " +

                        updatedSupplier.getName()

        );

        return toResponse(updatedSupplier);

    }

    public void deleteSupplier(Long supplierId) {

        Supplier supplier = supplierRepository.findById(supplierId)

                .orElseThrow(() ->

                        new RuntimeException("Supplier not found"));

        activityLogService.logActivity(

                ActivityModule.SUPPLIER,

                ActivityAction.DELETED,

                supplier.getSupplierId(),

                supplier.getName(),

                "Deleted supplier: " +

                        supplier.getName()

        );

        supplierRepository.delete(supplier);

    }

    // ================= Mapping Methods =================

    private Supplier toEntity(SupplierRequest request) {

        Supplier supplier = new Supplier();

        supplier.setName(request.getName());

        supplier.setPhNo(request.getPhNo());

        supplier.setEmail(request.getEmail());

        supplier.setAddress(request.getAddress());

        return supplier;

    }

    private SupplierResponse toResponse(Supplier supplier) {

        SupplierResponse response =

                new SupplierResponse();

        response.setSupplierId(

                supplier.getSupplierId()

        );

        response.setName(

                supplier.getName()

        );

        response.setPhNo(

                supplier.getPhNo()

        );

        response.setEmail(

                supplier.getEmail()

        );

        response.setAddress(

                supplier.getAddress()

        );

        return response;

    }

}