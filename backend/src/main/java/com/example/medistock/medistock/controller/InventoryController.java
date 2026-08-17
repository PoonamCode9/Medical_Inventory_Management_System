package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.model.*;
import com.example.medistock.medistock.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class InventoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private StockLogRepository stockLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // ==========================================
    // SUPPLIERS CRUD
    // ==========================================
    @GetMapping("/suppliers")
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @GetMapping("/suppliers/{id}")
    public ResponseEntity<?> getSupplierById(@PathVariable Long id) {
        return supplierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/suppliers")
    public ResponseEntity<?> createSupplier(@RequestBody Map<String, Object> payload) {
        try {
            Supplier supplier = new Supplier();
            if (payload.containsKey("supplierName") || payload.containsKey("supplier_name")) {
                supplier.setSupplierName((String) payload.getOrDefault("supplierName", payload.get("supplier_name")));
            }
            if (payload.containsKey("contactNumber") || payload.containsKey("contact_number")) {
                supplier.setContactNumber((String) payload.getOrDefault("contactNumber", payload.get("contact_number")));
            }
            if (payload.containsKey("email")) {
                supplier.setEmail((String) payload.get("email"));
            }
            if (payload.containsKey("address")) {
                supplier.setAddress((String) payload.get("address"));
            }
            if (payload.containsKey("performanceRating") || payload.containsKey("performance_rating")) {
                Object r = payload.getOrDefault("performanceRating", payload.get("performance_rating"));
                if (r != null) {
                    supplier.setPerformanceRating(new BigDecimal(r.toString()));
                }
            }

            Supplier saved = supplierRepository.save(supplier);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to add supplier: " + e.getMessage());
        }
    }

    @PutMapping("/suppliers/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return supplierRepository.findById(id).map(sup -> {
            if (payload.containsKey("supplierName") || payload.containsKey("supplier_name")) {
                sup.setSupplierName((String) payload.getOrDefault("supplierName", payload.get("supplier_name")));
            }
            if (payload.containsKey("contactNumber") || payload.containsKey("contact_number")) {
                sup.setContactNumber((String) payload.getOrDefault("contactNumber", payload.get("contact_number")));
            }
            if (payload.containsKey("email")) {
                sup.setEmail((String) payload.get("email"));
            }
            if (payload.containsKey("address")) {
                sup.setAddress((String) payload.get("address"));
            }
            if (payload.containsKey("performanceRating") || payload.containsKey("performance_rating")) {
                Object r = payload.getOrDefault("performanceRating", payload.get("performance_rating"));
                if (r != null) {
                    sup.setPerformanceRating(new BigDecimal(r.toString()));
                }
            }

            Supplier saved = supplierRepository.save(sup);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/suppliers/{id}")
    @Transactional
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        if (supplierRepository.existsById(id)) {
            // Unlink supplier from medicines before deletion
            List<Medicine> meds = medicineRepository.findAll().stream()
                    .filter(m -> m.getSupplier() != null && m.getSupplier().getId().equals(id))
                    .toList();
            for (Medicine med : meds) {
                med.setSupplier(null);
                medicineRepository.save(med);
            }
            supplierRepository.deleteById(id);
            return ResponseEntity.ok("Supplier deleted successfully.");
        }
        return ResponseEntity.notFound().build();
    }

    // ==========================================
    // MEDICINES CRUD
    // ==========================================
    @GetMapping("/medicines")
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @GetMapping("/medicines/{id}")
    public ResponseEntity<?> getMedicineById(@PathVariable Long id) {
        return medicineRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/medicines")
    public ResponseEntity<?> createMedicine(@RequestBody Map<String, Object> payload) {
        try {
            Medicine medicine = new Medicine();
            String name = (String) payload.getOrDefault("medicineName", payload.get("medicine_name"));
            medicine.setMedicineName(name != null ? name : "Unnamed Medicine");

            Object priceObj = payload.get("price");
            if (priceObj != null) {
                medicine.setPrice(new BigDecimal(priceObj.toString()));
            } else {
                medicine.setPrice(BigDecimal.ZERO);
            }

            // Category resolution
            Object catIdObj = payload.get("categoryId");
            if (catIdObj == null) catIdObj = payload.get("category_id");
            if (catIdObj == null && payload.get("category") instanceof Map) {
                catIdObj = ((Map<?, ?>) payload.get("category")).get("id");
            }
            if (catIdObj != null && !catIdObj.toString().isBlank()) {
                Long catId = Long.parseLong(catIdObj.toString());
                categoryRepository.findById(catId).ifPresent(medicine::setCategory);
            }

            // Supplier resolution
            Object supIdObj = payload.get("supplierId");
            if (supIdObj == null) supIdObj = payload.get("supplier_id");
            if (supIdObj == null && payload.get("supplier") instanceof Map) {
                supIdObj = ((Map<?, ?>) payload.get("supplier")).get("id");
            }
            if (supIdObj != null && !supIdObj.toString().isBlank()) {
                Long supId = Long.parseLong(supIdObj.toString());
                supplierRepository.findById(supId).ifPresent(medicine::setSupplier);
            }

            Medicine saved = medicineRepository.save(medicine);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to add medicine: " + e.getMessage());
        }
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return medicineRepository.findById(id).map(med -> {
            if (payload.containsKey("medicineName") || payload.containsKey("medicine_name")) {
                String name = (String) payload.getOrDefault("medicineName", payload.get("medicine_name"));
                if (name != null) med.setMedicineName(name);
            }

            if (payload.containsKey("price")) {
                Object priceObj = payload.get("price");
                if (priceObj != null) {
                    med.setPrice(new BigDecimal(priceObj.toString()));
                }
            }

            // Category resolution
            Object catIdObj = payload.get("categoryId");
            if (catIdObj == null) catIdObj = payload.get("category_id");
            if (catIdObj == null && payload.get("category") instanceof Map) {
                catIdObj = ((Map<?, ?>) payload.get("category")).get("id");
            }
            if (catIdObj != null && !catIdObj.toString().isBlank()) {
                Long catId = Long.parseLong(catIdObj.toString());
                categoryRepository.findById(catId).ifPresent(med::setCategory);
            }

            // Supplier resolution
            Object supIdObj = payload.get("supplierId");
            if (supIdObj == null) supIdObj = payload.get("supplier_id");
            if (supIdObj == null && payload.get("supplier") instanceof Map) {
                supIdObj = ((Map<?, ?>) payload.get("supplier")).get("id");
            }
            if (supIdObj != null && !supIdObj.toString().isBlank()) {
                Long supId = Long.parseLong(supIdObj.toString());
                supplierRepository.findById(supId).ifPresent(med::setSupplier);
            }

            Medicine saved = medicineRepository.save(med);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/medicines/{id}")
    @Transactional
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        if (medicineRepository.existsById(id)) {
            // Delete inventory batches for this medicine
            List<Inventory> batches = inventoryRepository.findAll().stream()
                    .filter(inv -> inv.getMedicine() != null && inv.getMedicine().getId().equals(id))
                    .toList();
            for (Inventory batch : batches) {
                // Delete stock logs referencing this batch
                List<StockLog> logs = stockLogRepository.findAll().stream()
                        .filter(l -> l.getInventoryId() != null && l.getInventoryId().equals(batch.getId()))
                        .toList();
                stockLogRepository.deleteAll(logs);
                inventoryRepository.delete(batch);
            }
            medicineRepository.deleteById(id);
            return ResponseEntity.ok("Medicine deleted successfully.");
        }
        return ResponseEntity.notFound().build();
    }

    // ==========================================
    // CATEGORIES CRUD
    // ==========================================
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category updated) {
        return categoryRepository.findById(id).map(cat -> {
            if (updated.getName() != null) cat.setName(updated.getName());
            return ResponseEntity.ok(categoryRepository.save(cat));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok("Category deleted");
        }
        return ResponseEntity.notFound().build();
    }

    // ==========================================
    // INVENTORY BATCHES CRUD & EXPIRY
    // ==========================================
    @GetMapping("/stocks")
    public List<Inventory> getAllStocks() {
        return inventoryRepository.findAll();
    }

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/stocks/{id}")
    public ResponseEntity<?> getStockById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInventoryById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/expiring")
    public List<Inventory> getExpiringBatches(@RequestParam(defaultValue = "30") int days) {
        LocalDate today = LocalDate.now();
        LocalDate threshold = today.plusDays(days);

        return inventoryRepository.findAll().stream()
                .filter(inv -> inv.getExpiryDate() != null &&
                        !inv.getExpiryDate().isBefore(today) &&
                        !inv.getExpiryDate().isAfter(threshold))
                .collect(Collectors.toList());
    }

    @PostMapping("/stocks")
    @Transactional
    public ResponseEntity<?> addStockBatch(@RequestBody Map<String, Object> payload) {
        return saveInventoryBatchFromMap(payload);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> addBatch(@RequestBody Map<String, Object> payload) {
        return saveInventoryBatchFromMap(payload);
    }

    private ResponseEntity<?> saveInventoryBatchFromMap(Map<String, Object> payload) {
        try {
            Inventory batch = new Inventory();

            // 1. Resolve Medicine
            Medicine targetMedicine = null;
            Object medIdObj = payload.get("medicineId");
            if (medIdObj == null) medIdObj = payload.get("medicine_id");
            if (medIdObj == null && payload.get("medicine") instanceof Map) {
                medIdObj = ((Map<?, ?>) payload.get("medicine")).get("id");
            }

            if (medIdObj != null && !medIdObj.toString().isBlank()) {
                Long medId = Long.parseLong(medIdObj.toString());
                Optional<Medicine> medOpt = medicineRepository.findById(medId);
                if (medOpt.isPresent()) {
                    targetMedicine = medOpt.get();
                }
            }

            String customMedName = (String) payload.get("custom_medicine_name");
            if (targetMedicine == null && customMedName != null && !customMedName.isBlank()) {
                Medicine newMed = new Medicine();
                newMed.setMedicineName(customMedName);
                newMed.setPrice(BigDecimal.valueOf(100.00));
                targetMedicine = medicineRepository.save(newMed);
            }

            if (targetMedicine == null) {
                List<Medicine> allMeds = medicineRepository.findAll();
                if (!allMeds.isEmpty()) {
                    targetMedicine = allMeds.get(0);
                } else {
                    Medicine fallback = new Medicine();
                    fallback.setMedicineName("Standard Medicine");
                    fallback.setPrice(BigDecimal.valueOf(50.00));
                    targetMedicine = medicineRepository.save(fallback);
                }
            }
            batch.setMedicine(targetMedicine);

            // 2. Batch Number
            String batchNum = (String) payload.getOrDefault("batchNumber", payload.get("batch_number"));
            if (batchNum == null || batchNum.isBlank()) {
                batchNum = "BATCH-" + System.currentTimeMillis() % 100000;
            }
            batch.setBatchNumber(batchNum);

            // 3. Quantity
            Object qtyObj = payload.get("quantity");
            int qty = qtyObj != null ? Integer.parseInt(qtyObj.toString()) : 0;
            batch.setQuantity(qty);

            // 4. Dates
            Object mfgObj = payload.getOrDefault("manufacturingDate", payload.get("manufacturing_date"));
            if (mfgObj != null && !mfgObj.toString().isBlank()) {
                batch.setManufacturingDate(LocalDate.parse(mfgObj.toString()));
            } else {
                batch.setManufacturingDate(LocalDate.now());
            }

            Object expObj = payload.getOrDefault("expiryDate", payload.get("expiry_date"));
            if (expObj != null && !expObj.toString().isBlank()) {
                batch.setExpiryDate(LocalDate.parse(expObj.toString()));
            } else {
                batch.setExpiryDate(LocalDate.now().plusYears(1));
            }

            // 5. Status
            if (qty == 0) {
                batch.setStockStatus("OUT_OF_STOCK");
            } else if (qty <= 20) {
                batch.setStockStatus("LOW_STOCK");
            } else {
                batch.setStockStatus("IN_STOCK");
            }

            Inventory saved = inventoryRepository.save(batch);

            // 6. Create Stock Log
            StockLog log = new StockLog();
            log.setInventoryId(saved.getId());
            log.setMovementType("ADDED");
            log.setQuantityChanged(qty);
            log.setLogDate(LocalDate.now());
            stockLogRepository.save(log);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to add batch: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return updateInventoryBatch(id, payload);
    }

    @PutMapping("/stocks/{id}")
    @Transactional
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return updateInventoryBatch(id, payload);
    }

    private ResponseEntity<?> updateInventoryBatch(Long id, Map<String, Object> payload) {
        return inventoryRepository.findById(id).map(batch -> {
            if (payload.containsKey("batchNumber") || payload.containsKey("batch_number")) {
                batch.setBatchNumber((String) payload.getOrDefault("batchNumber", payload.get("batch_number")));
            }
            if (payload.containsKey("quantity")) {
                Object q = payload.get("quantity");
                if (q != null) {
                    int qty = Integer.parseInt(q.toString());
                    batch.setQuantity(qty);
                    if (qty == 0) batch.setStockStatus("OUT_OF_STOCK");
                    else if (qty <= 20) batch.setStockStatus("LOW_STOCK");
                    else batch.setStockStatus("IN_STOCK");
                }
            }
            if (payload.containsKey("manufacturingDate") || payload.containsKey("manufacturing_date")) {
                Object d = payload.getOrDefault("manufacturingDate", payload.get("manufacturing_date"));
                if (d != null && !d.toString().isBlank()) batch.setManufacturingDate(LocalDate.parse(d.toString()));
            }
            if (payload.containsKey("expiryDate") || payload.containsKey("expiry_date")) {
                Object d = payload.getOrDefault("expiryDate", payload.get("expiry_date"));
                if (d != null && !d.toString().isBlank()) batch.setExpiryDate(LocalDate.parse(d.toString()));
            }
            if (payload.containsKey("stockStatus") || payload.containsKey("stock_status")) {
                batch.setStockStatus((String) payload.getOrDefault("stockStatus", payload.get("stock_status")));
            }

            // Medicine resolution
            Object medIdObj = payload.get("medicineId");
            if (medIdObj == null) medIdObj = payload.get("medicine_id");
            if (medIdObj != null && !medIdObj.toString().isBlank()) {
                Long medId = Long.parseLong(medIdObj.toString());
                medicineRepository.findById(medId).ifPresent(batch::setMedicine);
            }

            Inventory saved = inventoryRepository.save(batch);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        return deleteBatchInternal(id);
    }

    @DeleteMapping("/stocks/{id}")
    @Transactional
    public ResponseEntity<?> deleteStock(@PathVariable Long id) {
        return deleteBatchInternal(id);
    }

    private ResponseEntity<?> deleteBatchInternal(Long id) {
        if (inventoryRepository.existsById(id)) {
            // Delete stock logs for this inventory
            List<StockLog> logs = stockLogRepository.findAll().stream()
                    .filter(l -> l.getInventoryId() != null && l.getInventoryId().equals(id))
                    .toList();
            stockLogRepository.deleteAll(logs);
            inventoryRepository.deleteById(id);
            return ResponseEntity.ok("Batch deleted successfully.");
        }
        return ResponseEntity.notFound().build();
    }

    // Proxy for notifications
    @GetMapping("/notifications")
    public List<Notification> getNotifications() {
        return notificationRepository.findAll();
    }
}