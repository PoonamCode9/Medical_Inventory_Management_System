package com.medistock.backend.service;

import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.model.Supplier;
import com.medistock.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }

    @Override
    public Supplier createSupplier(Supplier supplier) {
        Supplier saved = supplierRepository.save(supplier);
        auditLogService.logAction("CREATE_SUPPLIER", "Created supplier: " + supplier.getName());
        return saved;
    }

    @Override
    public Supplier updateSupplier(Long id, Supplier supplier) {
        Supplier existing = getSupplierById(id);
        existing.setName(supplier.getName());
        existing.setContactPerson(supplier.getContactPerson());
        existing.setEmail(supplier.getEmail());
        existing.setPhone(supplier.getPhone());
        existing.setAddress(supplier.getAddress());
        Supplier saved = supplierRepository.save(existing);
        auditLogService.logAction("UPDATE_SUPPLIER", "Updated supplier: " + supplier.getName());
        return saved;
    }

    @Override
    public void deleteSupplier(Long id) {
        Supplier existing = getSupplierById(id);
        supplierRepository.delete(existing);
        auditLogService.logAction("DELETE_SUPPLIER", "Deleted supplier: " + existing.getName());
    }
}
