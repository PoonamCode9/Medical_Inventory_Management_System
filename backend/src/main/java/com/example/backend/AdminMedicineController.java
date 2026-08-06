package com.example.backend;

import com.example.backend.dto.MedicineWithSuppliersDto;
import com.example.backend.junction.SupplierMedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/medicines")
public class AdminMedicineController {

private final MedicineRepository medicineRepository;
    private final SupplierMedicineService supplierMedicineService;
    private final DispenseItemRepository dispenseItemRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final MedicineAlertScheduler medicineAlertScheduler;

    public AdminMedicineController(MedicineRepository medicineRepository,
                                   SupplierMedicineService supplierMedicineService,
                                   DispenseItemRepository dispenseItemRepository,
                                   PurchaseOrderItemRepository purchaseOrderItemRepository,
                                   MedicineAlertScheduler medicineAlertScheduler) {
        this.medicineRepository = medicineRepository;
        this.supplierMedicineService = supplierMedicineService;
        this.dispenseItemRepository = dispenseItemRepository;
        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
        this.medicineAlertScheduler = medicineAlertScheduler;
    }

    // Medicines list (include supplier names)
    @GetMapping
    public ResponseEntity<List<MedicineWithSuppliersDto>> listMedicines() {
        List<Medicine> meds = medicineRepository.findAll();
        return ResponseEntity.ok(
                meds.stream().map(med -> {
                    MedicineWithSuppliersDto dto = new MedicineWithSuppliersDto();
                    dto.setId(med.getId());
                    dto.setName(med.getName());
                    dto.setBatchNumber(med.getBatchNumber());
                    dto.setCategory(med.getCategory());
                    dto.setQuantity(med.getQuantity());
                    dto.setExpiryDate(med.getExpiryDate());
                    dto.setPrice(med.getPrice());
                    dto.setSuppliers(supplierMedicineService.getSuppliersForMedicine(med.getId()));
                    return dto;
                }).toList()
        );
    }

    // Create medicine + junction rows
    @PostMapping
    @Transactional
    public ResponseEntity<?> createMedicine(@RequestBody CreateMedicineRequest request) {
        if (request == null ||
                request.getName() == null || request.getName().isBlank() ||
                request.getBatchNumber() == null || request.getBatchNumber().isBlank() ||
                request.getCategory() == null || request.getCategory().isBlank() ||
                request.getQuantity() == null ||
                request.getExpiryDate() == null ||
                request.getPrice() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "name, batchNumber, category, quantity, expiryDate and price are required"
            ));
        }

        Optional<Medicine> existing = medicineRepository.findByBatchNumber(request.getBatchNumber().trim());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Batch number already exists"
            ));
        }

        Medicine saved = medicineRepository.save(new Medicine(
                request.getName().trim(),
                request.getBatchNumber().trim(),
                request.getCategory().trim(),
                request.getQuantity(),
                request.getExpiryDate(),
                request.getPrice()
        ));

supplierMedicineService.replaceSuppliersForMedicine(saved.getId(), request.getSupplierIds());

        // Trigger immediate notification check for the new medicine
        medicineAlertScheduler.checkSingleMedicine(saved);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "batchNumber", saved.getBatchNumber(),
                "category", saved.getCategory(),
                "quantity", saved.getQuantity(),
                "expiryDate", saved.getExpiryDate(),
                "price", saved.getPrice()
        ));
    }

    // Update medicine + replace junction rows
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateMedicine(
            @PathVariable Integer id,
            @RequestBody CreateMedicineRequest request
    ) {
        if (request == null ||
                request.getName() == null || request.getName().isBlank() ||
                request.getBatchNumber() == null || request.getBatchNumber().isBlank() ||
                request.getCategory() == null || request.getCategory().isBlank() ||
                request.getQuantity() == null ||
                request.getExpiryDate() == null ||
                request.getPrice() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "name, batchNumber, category, quantity, expiryDate and price are required"
            ));
        }

        Optional<Medicine> medOpt = medicineRepository.findById(id);
        if (medOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String trimmedBatch = request.getBatchNumber().trim();
        Optional<Medicine> existingBatch = medicineRepository.findByBatchNumber(trimmedBatch);

        Medicine med = medOpt.get();
        if (existingBatch.isPresent() && !existingBatch.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Batch number already exists"
            ));
        }

        med.setName(request.getName().trim());
        med.setBatchNumber(trimmedBatch);
        med.setCategory(request.getCategory().trim());
        med.setQuantity(request.getQuantity());
        med.setExpiryDate(request.getExpiryDate());
        med.setPrice(request.getPrice());

        Medicine saved = medicineRepository.save(med);

        supplierMedicineService.replaceSuppliersForMedicine(saved.getId(), request.getSupplierIds());

        // Trigger immediate notification check for the updated medicine
        medicineAlertScheduler.checkSingleMedicine(saved);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "batchNumber", saved.getBatchNumber(),
                "category", saved.getCategory(),
                "quantity", saved.getQuantity(),
                "expiryDate", saved.getExpiryDate(),
                "price", saved.getPrice()
        ));
    }

    // Delete medicine
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteMedicine(@PathVariable Integer id) {
        if (!medicineRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

// Block deletion if this medicine is referenced in any dispensing records
        // (dispensing history must be preserved)
        List<DispenseItem> dispenseItems = dispenseItemRepository.findByMedicineId(id);
        if (!dispenseItems.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Cannot delete medicine ID " + id + " — it is referenced in existing dispensing records. Remove dispensing records first."
            ));
        }

        // Clean up related references before deleting the medicine:
        // 1. Remove supplier_medicines junction rows
        supplierMedicineService.deleteSuppliersForMedicine(id);

        // 2. Remove purchase_order_items referencing this medicine
        purchaseOrderItemRepository.deleteByMedicineId(id);

        // 3. Finally delete the medicine itself
        medicineRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Junction operations (used by frontend preselect/update)
    @GetMapping("/{id}/suppliers")
    public ResponseEntity<?> getSuppliersForMedicine(@PathVariable Integer id) {
        return ResponseEntity.ok(supplierMedicineService.getSupplierIdsForMedicine(id));
    }

    @PostMapping("/{id}/suppliers")
    public ResponseEntity<?> setSuppliersForMedicine(
            @PathVariable Integer id,
            @RequestBody SetSuppliersRequest request
    ) {
        if (!medicineRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Integer> supplierIds = request == null ? null : request.getSupplierIds();
        supplierMedicineService.replaceSuppliersForMedicine(id, supplierIds);
        return ResponseEntity.ok().build();
    }

    public static class SetSuppliersRequest {
        private List<Integer> supplierIds;

        public List<Integer> getSupplierIds() {
            return supplierIds;
        }

        public void setSupplierIds(List<Integer> supplierIds) {
            this.supplierIds = supplierIds;
        }
    }

    public static class CreateMedicineRequest {
        private String name;
        private String batchNumber;
        private String category;
        private Integer quantity;
        private LocalDate expiryDate;
        private BigDecimal price;
        private List<Integer> supplierIds;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getBatchNumber() {
            return batchNumber;
        }

        public void setBatchNumber(String batchNumber) {
            this.batchNumber = batchNumber;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public LocalDate getExpiryDate() {
            return expiryDate;
        }

        public void setExpiryDate(LocalDate expiryDate) {
            this.expiryDate = expiryDate;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public List<Integer> getSupplierIds() {
            return supplierIds;
        }

        public void setSupplierIds(List<Integer> supplierIds) {
            this.supplierIds = supplierIds;
        }
    }
}

