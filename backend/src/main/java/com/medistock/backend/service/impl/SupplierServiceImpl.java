package com.medistock.backend.service.impl;

import com.medistock.backend.entity.Supplier;
import com.medistock.backend.exception.DuplicateResourceException;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.service.SupplierService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final com.medistock.backend.service.NotificationService notificationService;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[0-9]{10,15}$");

    @PostConstruct
    @Transactional
    public void seedSuppliers() {
        if (supplierRepository.count() == 0) {
            supplierRepository.save(Supplier.builder()
                    .supplierName("Acme Pharmaceuticals")
                    .contactPerson("John Acme")
                    .phone("5550111111")
                    .email("contact@acme.com")
                    .address("123 Pharma St, Biotech Park")
                    .status(true)
                    .build());
            
            supplierRepository.save(Supplier.builder()
                    .supplierName("Global Meds Inc")
                    .contactPerson("Alice Meds")
                    .phone("5550222222")
                    .email("sales@globalmeds.com")
                    .address("456 Health Blvd, Sector 9")
                    .status(true)
                    .build());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Supplier getSupplierById(Integer id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + id));
    }

    @Override
    @Transactional
    public Supplier createSupplier(Supplier supplier) {
        trimAndSanitize(supplier);
        validateSupplier(supplier, null);
        Supplier saved = supplierRepository.save(supplier);
        notificationService.createNotification(
                null,
                "Supplier Added",
                saved.getSupplierName() + " added successfully.",
                "SUCCESS",
                "LOW",
                "SUPPLIER",
                saved.getSupplierId()
        );
        return saved;
    }

    @Override
    @Transactional
    public Supplier updateSupplier(Integer id, Supplier supplierDetails) {
        Supplier supplier = getSupplierById(id);
        trimAndSanitize(supplierDetails);
        validateSupplier(supplierDetails, id);
        
        supplier.setSupplierName(supplierDetails.getSupplierName());
        supplier.setContactPerson(supplierDetails.getContactPerson());
        supplier.setPhone(supplierDetails.getPhone());
        supplier.setEmail(supplierDetails.getEmail());
        supplier.setAddress(supplierDetails.getAddress());
        supplier.setStatus(supplierDetails.getStatus());
        Supplier saved = supplierRepository.save(supplier);
        notificationService.createNotification(
                null,
                "Supplier Updated",
                saved.getSupplierName() + " updated successfully.",
                "INFO",
                "LOW",
                "SUPPLIER",
                saved.getSupplierId()
        );
        return saved;
    }

    @Override
    @Transactional
    public void deleteSupplier(Integer id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
        notificationService.createNotification(
                null,
                "Supplier Deleted",
                supplier.getSupplierName() + " removed successfully.",
                "INFO",
                "LOW",
                "SUPPLIER",
                id
        );
    }

    private void trimAndSanitize(Supplier s) {
        if (s.getSupplierName() != null) s.setSupplierName(s.getSupplierName().trim());
        if (s.getContactPerson() != null) s.setContactPerson(s.getContactPerson().trim());
        if (s.getPhone() != null) s.setPhone(s.getPhone().trim().replaceAll("\\s+", ""));
        if (s.getEmail() != null) s.setEmail(s.getEmail().trim().toLowerCase());
        if (s.getAddress() != null) s.setAddress(s.getAddress().trim());
    }

    private void validateSupplier(Supplier supplier, Integer updateId) {
        // Name validation
        if (supplier.getSupplierName() == null || supplier.getSupplierName().isEmpty()) {
            throw new IllegalArgumentException("Supplier Name is required.");
        }

        // Duplicate Supplier Name check
        Optional<Supplier> existingName = supplierRepository.findBySupplierName(supplier.getSupplierName());
        if (existingName.isPresent() && (updateId == null || !existingName.get().getSupplierId().equals(updateId))) {
            throw new DuplicateResourceException("Supplier Name already exists.");
        }

        // Phone validation
        if (supplier.getPhone() == null || supplier.getPhone().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required.");
        }

        if (!PHONE_PATTERN.matcher(supplier.getPhone()).matches()) {
            throw new IllegalArgumentException("Invalid Phone number format. Must be 10-15 digits.");
        }

        // Phone uniqueness validation
        Optional<Supplier> existingPhone = supplierRepository.findByPhone(supplier.getPhone());
        if (existingPhone.isPresent() && (updateId == null || !existingPhone.get().getSupplierId().equals(updateId))) {
            throw new DuplicateResourceException("Supplier Phone number already exists.");
        }

        // Email validation
        if (supplier.getEmail() != null && !supplier.getEmail().isEmpty()) {
            if (!EMAIL_PATTERN.matcher(supplier.getEmail()).matches()) {
                throw new IllegalArgumentException("Invalid Email format.");
            }
            
            // Email uniqueness validation
            Optional<Supplier> existingEmail = supplierRepository.findByEmail(supplier.getEmail());
            if (existingEmail.isPresent() && (updateId == null || !existingEmail.get().getSupplierId().equals(updateId))) {
                throw new DuplicateResourceException("Supplier Email already exists.");
            }
        }
    }
}
