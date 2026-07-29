package com.medistock.backend.service;

import com.medistock.backend.entity.Supplier;
import java.util.List;

public interface SupplierService {
    List<Supplier> getAllSuppliers();
    Supplier getSupplierById(Integer id);
    Supplier createSupplier(Supplier supplier);
    Supplier updateSupplier(Integer id, Supplier supplier);
    void deleteSupplier(Integer id);
}
