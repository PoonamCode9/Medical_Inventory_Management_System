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
        // Name validation (Minimum 3 characters)
        if (supplier.getSupplierName() == null || supplier.getSupplierName().trim().isEmpty()) {
            throw new IllegalArgumentException("Supplier Name is required.");
        }
        if (supplier.getSupplierName().trim().length() < 3) {
            throw new IllegalArgumentException("Supplier Name must be at least 3 characters long.");
        }

        // Duplicate Supplier Name check
        Optional<Supplier> existingName = supplierRepository.findBySupplierName(supplier.getSupplierName());
        if (existingName.isPresent() && (updateId == null || !existingName.get().getSupplierId().equals(updateId))) {
            throw new DuplicateResourceException("Supplier Name already exists.");
        }

        // Contact Person validation
        if (supplier.getContactPerson() == null || supplier.getContactPerson().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact Person is required.");
        }

        // Phone validation (Exactly 10 digits)
        if (supplier.getPhone() == null || supplier.getPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required.");
        }
        String cleanPhone = supplier.getPhone().trim().replaceAll("\\s+", "");
        if (!cleanPhone.matches("^[0-9]{10}$")) {
            throw new IllegalArgumentException("Phone number must contain exactly 10 digits.");
        }

        // Phone uniqueness validation
        Optional<Supplier> existingPhone = supplierRepository.findByPhone(cleanPhone);
        if (existingPhone.isPresent() && (updateId == null || !existingPhone.get().getSupplierId().equals(updateId))) {
            throw new DuplicateResourceException("Supplier Phone number already exists.");
        }

        // Email validation (Mandatory and valid format)
        if (supplier.getEmail() == null || supplier.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email Address is required.");
        }
        if (!EMAIL_PATTERN.matcher(supplier.getEmail().trim()).matches()) {
            throw new IllegalArgumentException("Invalid Email address format.");
        }
        
        // Email uniqueness validation
        Optional<Supplier> existingEmail = supplierRepository.findByEmail(supplier.getEmail().trim().toLowerCase());
        if (existingEmail.isPresent() && (updateId == null || !existingEmail.get().getSupplierId().equals(updateId))) {
            throw new DuplicateResourceException("Supplier Email already exists.");
        }

        // Physical Address validation (Minimum 10 characters)
        if (supplier.getAddress() == null || supplier.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Physical Address is required.");
        }
        if (supplier.getAddress().trim().length() < 10) {
            throw new IllegalArgumentException("Address must be at least 10 characters long.");
        }

        // Status validation
        if (supplier.getStatus() == null) {
            throw new IllegalArgumentException("Supplier Status is required.");
        }
    }
}
