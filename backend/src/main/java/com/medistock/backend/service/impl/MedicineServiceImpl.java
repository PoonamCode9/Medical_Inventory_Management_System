package com.medistock.backend.service.impl;

import com.medistock.backend.dto.request.MedicineRequest;
import com.medistock.backend.dto.response.MedicineResponse;
import com.medistock.backend.entity.Category;
import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.StockLog;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.entity.User;
import com.medistock.backend.exception.DuplicateResourceException;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.repository.CategoryRepository;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.StockLogRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.MedicineService;
import com.medistock.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final StockLogRepository stockLogRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<MedicineResponse> getAllMedicines() {
        return medicineRepository.findAll().stream()
                .map(this::mapToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MedicineResponse getMedicineById(Integer id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));
        return mapToMedicineResponse(medicine);
    }

    @Override
    @Transactional
    public MedicineResponse createMedicine(MedicineRequest request, String email) {
        log.info("Request to create new medicine: {}", request.getMedicineName());

        // Perform validations
        validateMedicineRequest(request, null);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + request.getSupplierId()));

        Medicine medicine = Medicine.builder()
                .medicineName(request.getMedicineName())
                .genericName(request.getGenericName())
                .batchNumber(request.getBatchNumber())
                .category(category)
                .supplier(supplier)
                .manufacturer(request.getManufacturer())
                .manufactureDate(request.getManufactureDate())
                .expiryDate(request.getExpiryDate())
                .purchasePrice(request.getPurchasePrice())
                .sellingPrice(request.getSellingPrice())
                .unitPrice(request.getSellingPrice()) // Align with legacy schema
                .gst(request.getGst())
                .barcode(request.getBarcode())
                .imageUrl(request.getImageUrl())
                .description(request.getDescription())
                .dosage(request.getDosage())
                .unit(request.getUnit())
                .build();

        Medicine saved = medicineRepository.save(medicine);

        // Provision inventory mapping automatically
        Inventory inventory = Inventory.builder()
                .medicine(saved)
                .quantity(request.getQuantity())
                .minimumStock(request.getMinimumStock())
                .lastUpdated(LocalDateTime.now())
                .build();

        inventoryRepository.save(inventory);
        saved.setInventory(inventory);

        // Fetch user operator
        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        // 1. Create Stock Log automatically after medicine creation
        StockLog stockLog = StockLog.builder()
                .medicine(saved)
                .user(user)
                .action("CREATE")
                .oldQuantity(0)
                .newQuantity(request.getQuantity())
                .reason("New medicine catalog registration")
                .updatedAt(LocalDateTime.now())
                .build();
        stockLogRepository.save(stockLog);

        // 2. Notify users for medicine creation
        notificationService.createNotification(
                null, 
                "New Medicine Registered", 
                "Medicine \"" + saved.getMedicineName() + "\" (Batch: " + saved.getBatchNumber() + ") was successfully created in the system catalog by " + email + ".", 
                "INFO",
                "LOW",
                "MEDICINE",
                saved.getMedicineId()
        );

        // 3. Notify for Low Stock immediately if initialized below threshold
        if (request.getQuantity() <= request.getMinimumStock()) {
            notificationService.createNotification(
                    null,
                    "Low Stock Warning",
                    "Medicine \"" + saved.getMedicineName() + "\" is running low on stock. Current quantity: " + request.getQuantity(),
                    "LOW_STOCK",
                    "HIGH",
                    "INVENTORY",
                    saved.getMedicineId()
            );
        }

        log.info("Medicine created successfully with ID: {}", saved.getMedicineId());
        return mapToMedicineResponse(saved);
    }

    @Override
    @Transactional
    public MedicineResponse updateMedicine(Integer id, MedicineRequest request, String email) {
        log.info("Request to update medicine ID: {}", id);

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));

        // Perform validations
        validateMedicineRequest(request, id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + request.getSupplierId()));

        medicine.setMedicineName(request.getMedicineName());
        medicine.setGenericName(request.getGenericName());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setCategory(category);
        medicine.setSupplier(supplier);
        medicine.setManufacturer(request.getManufacturer());
        medicine.setManufactureDate(request.getManufactureDate());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setPurchasePrice(request.getPurchasePrice());
        medicine.setSellingPrice(request.getSellingPrice());
        medicine.setUnitPrice(request.getSellingPrice());
        medicine.setGst(request.getGst());
        medicine.setBarcode(request.getBarcode());
        medicine.setImageUrl(request.getImageUrl());
        medicine.setDescription(request.getDescription());
        medicine.setDosage(request.getDosage());
        medicine.setUnit(request.getUnit());

        Medicine saved = medicineRepository.save(medicine);

        // Update inventory levels and log stock if quantity changed
        Inventory inventory = saved.getInventory();
        if (inventory == null) {
            inventory = Inventory.builder().medicine(saved).build();
        }
        
        int oldQty = inventory.getQuantity() != null ? inventory.getQuantity() : 0;
        int newQty = request.getQuantity();

        inventory.setQuantity(newQty);
        inventory.setMinimumStock(request.getMinimumStock());
        inventory.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inventory);

        // Create Stock Log if quantity adjusted
        if (oldQty != newQty) {
            User user = null;
            if (email != null && !email.trim().isEmpty()) {
                user = userRepository.findByEmail(email).orElse(null);
            }
            StockLog stockLog = StockLog.builder()
                    .medicine(saved)
                    .user(user)
                    .action("ADJUST")
                    .oldQuantity(oldQty)
                    .newQuantity(newQty)
                    .updatedAt(LocalDateTime.now())
                    .build();
            stockLogRepository.save(stockLog);
            
            // Low Stock notification trigger
            if (newQty <= request.getMinimumStock()) {
                notificationService.createNotification(
                        null,
                        "Low Stock Alert",
                        "Medicine \"" + saved.getMedicineName() + "\" is running low on stock. Current quantity: " + newQty,
                        "LOW_STOCK",
                        "HIGH",
                        "INVENTORY",
                        saved.getMedicineId()
                );
            }
        }

        notificationService.createNotification(
                null,
                "Medicine Updated",
                "Medicine \"" + saved.getMedicineName() + "\" (Batch: " + saved.getBatchNumber() + ") details were successfully updated by " + email + ".",
                "INFO",
                "LOW",
                "MEDICINE",
                saved.getMedicineId()
        );

        log.info("Medicine updated successfully with ID: {}", saved.getMedicineId());
        return mapToMedicineResponse(saved);
    }

    @Override
    @Transactional
    public void deleteMedicine(Integer id, String email) {
        log.info("Request to delete medicine ID: {} by user: {}", id, email);
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));
        
        User user = null;
        if (email != null && !email.trim().isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        int currentQty = medicine.getInventory() != null ? medicine.getInventory().getQuantity() : 0;

        // Log Stock Removal
        StockLog stockLog = StockLog.builder()
                .medicine(medicine)
                .user(user)
                .action("DELETE")
                .oldQuantity(currentQty)
                .newQuantity(0)
                .reason("Medicine item removed from system catalog by " + email)
                .updatedAt(LocalDateTime.now())
                .build();
        stockLogRepository.save(stockLog);

        notificationService.createNotification(
                null,
                "Medicine Deleted",
                "Medicine \"" + medicine.getMedicineName() + "\" (Batch: " + medicine.getBatchNumber() + ") was removed from the system catalog by " + email + ".",
                "INFO",
                "LOW",
                "MEDICINE",
                id
        );

        medicineRepository.delete(medicine);
        log.info("Medicine deleted successfully with ID: {}", id);
    }

    // Helper validations
    private void validateMedicineRequest(MedicineRequest request, Integer updateId) {
        // Name validation
        if (request.getMedicineName() == null || request.getMedicineName().trim().isEmpty()) {
            throw new IllegalArgumentException("Medicine Name is required.");
        }

        // Category validation
        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("Category is required.");
        }

        // Supplier validation
        if (request.getSupplierId() == null) {
            throw new IllegalArgumentException("Supplier is required.");
        }

        // Batch number validation
        if (request.getBatchNumber() == null || request.getBatchNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Batch Number is required.");
        }

        // Expiry Date must be after Manufacturing Date
        if (request.getExpiryDate() == null || request.getManufactureDate() == null) {
            throw new IllegalArgumentException("Manufacturing and Expiry Dates are required.");
        }
        if (request.getExpiryDate().isBefore(request.getManufactureDate()) || request.getExpiryDate().isEqual(request.getManufactureDate())) {
            throw new IllegalArgumentException("Expiry Date must be after Manufacturing Date.");
        }

        // Selling Price must be greater than Purchase Price
        if (request.getPurchasePrice() == null || request.getSellingPrice() == null) {
            throw new IllegalArgumentException("Purchase and Selling Prices are required.");
        }
        if (request.getSellingPrice().compareTo(request.getPurchasePrice()) <= 0) {
            throw new IllegalArgumentException("Selling Price must be greater than Purchase Price.");
        }

        // Quantity cannot be negative
        if (request.getQuantity() == null || request.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative.");
        }

        // Minimum Stock cannot exceed Quantity
        if (request.getMinimumStock() == null || request.getMinimumStock() < 0) {
            throw new IllegalArgumentException("Minimum Stock cannot be negative.");
        }
        if (request.getMinimumStock() > request.getQuantity()) {
            throw new IllegalArgumentException("Minimum Stock cannot exceed current stock.");
        }

        // Duplicate Medicine Name validation
        Optional<Medicine> duplicateName = medicineRepository.findByMedicineNameIgnoreCase(request.getMedicineName().trim());
        if (duplicateName.isPresent() && (updateId == null || !duplicateName.get().getMedicineId().equals(updateId))) {
            throw new DuplicateResourceException("Medicine name already exists in the catalog.");
        }

        // Duplicate Batch Number validation
        Optional<Medicine> duplicateBatch = medicineRepository.findByBatchNumberIgnoreCase(request.getBatchNumber().trim());
        if (duplicateBatch.isPresent() && (updateId == null || !duplicateBatch.get().getMedicineId().equals(updateId))) {
            throw new DuplicateResourceException("Batch Number already exists.");
        }
    }

    // Helper: Map Entity to Response DTO
    private MedicineResponse mapToMedicineResponse(Medicine medicine) {
        String catName = medicine.getCategory() != null ? medicine.getCategory().getCategoryName() : "General";
        Integer catId = medicine.getCategory() != null ? medicine.getCategory().getCategoryId() : null;
        String suppName = medicine.getSupplier() != null ? medicine.getSupplier().getSupplierName() : "Default Supplier";
        Integer suppId = medicine.getSupplier() != null ? medicine.getSupplier().getSupplierId() : null;
        String suppEmail = medicine.getSupplier() != null ? medicine.getSupplier().getEmail() : "";
        String suppPhone = medicine.getSupplier() != null ? medicine.getSupplier().getPhone() : "";
        
        Integer qty = medicine.getInventory() != null ? medicine.getInventory().getQuantity() : 0;
        Integer minStock = medicine.getInventory() != null ? medicine.getInventory().getMinimumStock() : 10;

        Long daysUntilExpiry = null;
        String expiryStatus = "Safe";
        if (medicine.getExpiryDate() != null) {
            daysUntilExpiry = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), medicine.getExpiryDate());
            if (daysUntilExpiry < 0) {
                expiryStatus = "Expired";
            } else if (daysUntilExpiry <= 30) {
                expiryStatus = "Critical";
            } else if (daysUntilExpiry <= 60) {
                expiryStatus = "Expiring Soon";
            } else {
                expiryStatus = "Safe";
            }
        }
        Boolean isLowStock = qty <= minStock;

        return MedicineResponse.builder()
                .medicineId(medicine.getMedicineId())
                .medicineName(medicine.getMedicineName())
                .genericName(medicine.getGenericName())
                .categoryId(catId)
                .categoryName(catName)
                .supplierId(suppId)
                .supplierName(suppName)
                .supplierEmail(suppEmail)
                .supplierPhone(suppPhone)
                .batchNumber(medicine.getBatchNumber())
                .manufacturer(medicine.getManufacturer())
                .manufactureDate(medicine.getManufactureDate())
                .expiryDate(medicine.getExpiryDate())
                .purchasePrice(medicine.getPurchasePrice())
                .sellingPrice(medicine.getSellingPrice())
                .gst(medicine.getGst())
                .quantity(qty)
                .minimumStock(minStock)
                .barcode(medicine.getBarcode())
                .imageUrl(medicine.getImageUrl())
                .description(medicine.getDescription())
                .dosage(medicine.getDosage())
                .unit(medicine.getUnit())
                .daysUntilExpiry(daysUntilExpiry)
                .expiryStatus(expiryStatus)
                .isLowStock(isLowStock)
                .build();
    }
}
