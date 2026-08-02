package com.medicalinventory.service;

import com.medicalinventory.entity.Supplier;
import java.util.List;

public interface SupplierService {

    Supplier addSupplier(Supplier supplier);

    List<Supplier> getAllSuppliers();

    Supplier getSupplierById(Long id);

    Supplier updateSupplier(Long id, Supplier supplier);

    void deleteSupplier(Long id);
    Long getSupplierCount();
}
