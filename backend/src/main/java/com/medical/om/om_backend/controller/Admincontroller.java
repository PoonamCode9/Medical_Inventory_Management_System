package com.medical.om.om_backend.controller;

import java.util.*;

import com.medical.om.om_backend.Dto.InventoryDto;
import com.medical.om.om_backend.Dto.MedicineDto;
import com.medical.om.om_backend.Dto.SupplierDto;
import com.medical.om.om_backend.Dto.UserDto;
import com.medical.om.om_backend.Dto.SalesPurchaseDto;
import com.medical.om.om_backend.entity.Inventory;
import com.medical.om.om_backend.entity.Medicine;
import com.medical.om.om_backend.entity.Suppliers;
import com.medical.om.om_backend.entity.Users;
import com.medical.om.om_backend.entity.SalesPurchase;
import com.medical.om.om_backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.medical.om.om_backend.repository.InventoryRepository;
import com.medical.om.om_backend.repository.MedicineRepository;
import com.medical.om.om_backend.repository.SupplierRepository;
import com.medical.om.om_backend.repository.UserRepository;
import com.medical.om.om_backend.repository.SalesPurchaseRepository;

@RestController
@RequestMapping("/api/admin")
public class Admincontroller {
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final SalesPurchaseRepository salesPurchaseRepository;
    private final PasswordEncoder passwordEncoder;
    private final DashboardService dashboardService;

    public Admincontroller(UserRepository userRepository,
                           MedicineRepository medicineRepository,
                           InventoryRepository inventoryRepository,
                           SupplierRepository supplierRepository,
                           SalesPurchaseRepository salesPurchaseRepository,
                           PasswordEncoder passwordEncoder,
                           DashboardService dashboardService) {
        this.userRepository = userRepository;
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.salesPurchaseRepository = salesPurchaseRepository;
        this.passwordEncoder = passwordEncoder;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = dashboardService.getCommonStats();
        stats.put("totalUsers", userRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserDto request) {
        Users user = new Users();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto request) {
        return userRepository.findById(id).map(user -> {
            user.setName(request.getName());
            user.setUsername(request.getUsername());
            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            user.setRole(request.getRole());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<Medicine>> getMedicines() {
        return ResponseEntity.ok(medicineRepository.findAll());
    }

    @PostMapping("/medicines")
    public ResponseEntity<?> createMedicine(@RequestBody MedicineDto request) {
        Medicine medicine = new Medicine();
        medicine.setName(request.getName());
        medicine.setBatch(request.getBatch());
        medicine.setManufacturing_date(request.getManufacturing_date());
        medicine.setExpiration_date(request.getExpiration_date());
        medicine.setCategory(request.getCategory());
        medicine.setDescription(request.getDescription());
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody MedicineDto request) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setName(request.getName());
            medicine.setBatch(request.getBatch());
            medicine.setManufacturing_date(request.getManufacturing_date());
            medicine.setExpiration_date(request.getExpiration_date());
            medicine.setCategory(request.getCategory());
            medicine.setDescription(request.getDescription());
            return ResponseEntity.ok(medicineRepository.save(medicine));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<Inventory>> getInventory() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PostMapping("/inventory")
    public ResponseEntity<?> createInventory(@RequestBody InventoryDto request) {
        Medicine medicine = medicineRepository.findById(request.getMedicineId()).orElseThrow(()->new RuntimeException("Medicine not found"));
        Inventory inventory = new Inventory();
        inventory.setMedicine(medicine);
        inventory.setMedicine_name(medicine.getName());
        inventory.setBatch(request.getBatch());
        inventory.setAvailable_qty(request.getAvailable_qty());
        inventory.setSupplier(request.getSupplier());
        if (request.getManufacturing_date() != null) inventory.setManufacturing_date(java.time.LocalDate.parse(request.getManufacturing_date()));
        if (request.getExpiration_date() != null) inventory.setExpiration_date(java.time.LocalDate.parse(request.getExpiration_date()));
        return ResponseEntity.ok(inventoryRepository.save(inventory));
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @RequestBody InventoryDto request) {
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        return inventoryRepository.findById(id).map(inventory -> {
            inventory.setMedicine(medicine);
            inventory.setMedicine_name(medicine.getName());
            inventory.setBatch(request.getBatch());
            inventory.setAvailable_qty(request.getAvailable_qty());
            inventory.setSupplier(request.getSupplier());
            if (request.getManufacturing_date() != null) inventory.setManufacturing_date(java.time.LocalDate.parse(request.getManufacturing_date()));
            if (request.getExpiration_date() != null) inventory.setExpiration_date(java.time.LocalDate.parse(request.getExpiration_date()));
            return ResponseEntity.ok(inventoryRepository.save(inventory));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        inventoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/suppliers")
    public ResponseEntity<List<Suppliers>> getSuppliers() {
        return ResponseEntity.ok(supplierRepository.findAll());
    }

    @PostMapping("/suppliers")
    public ResponseEntity<?> createSupplier(@RequestBody SupplierDto request) {
        Suppliers supplier = new Suppliers();
        supplier.setName(request.getName());
        supplier.setAddress(request.getAddress());
        supplier.setJoinedfrom(request.getJoinedfrom());
        supplier.setContact(request.getContact());
        supplier.setEmail(request.getEmail());
        return ResponseEntity.ok(supplierRepository.save(supplier));
    }

    @PutMapping("/suppliers/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody SupplierDto request) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(request.getName());
            supplier.setAddress(request.getAddress());
            supplier.setJoinedfrom(request.getJoinedfrom());
            supplier.setContact(request.getContact());
            supplier.setEmail(request.getEmail());
            return ResponseEntity.ok(supplierRepository.save(supplier));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        supplierRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ─── Inventory helper ─────────────────────────────────
    private void adjustInventory(Medicine medicine, String batch, int delta,
                                 String supplierName, java.time.LocalDate mfg, java.time.LocalDate exp) {
        inventoryRepository.findByMedicine_IdAndBatch(medicine.getId(), batch)
            .ifPresentOrElse(inv -> {
                inv.setMedicine_name(medicine.getName());
                inv.setAvailable_qty(inv.getAvailable_qty() + delta);
                inventoryRepository.save(inv);
            }, () -> {
                if (delta > 0) {
                    Inventory inv = new Inventory();
                    inv.setMedicine(medicine);
                    inv.setMedicine_name(medicine.getName());
                    inv.setBatch(batch);
                    inv.setAvailable_qty(delta);
                    inv.setSupplier(supplierName != null ? supplierName : "");
                    inv.setManufacturing_date(mfg);
                    inv.setExpiration_date(exp);
                    inventoryRepository.save(inv);
                }
            });
    }

    // Sales and Purchases CRUD
    @GetMapping("/sales")
    public ResponseEntity<List<SalesPurchase>> getSalesPurchases() {
        return ResponseEntity.ok(salesPurchaseRepository.findAll());
    }

    @PostMapping("/sales")
    public ResponseEntity<?> createSalesPurchase(@RequestBody SalesPurchaseDto request) {
        Medicine medicine;
        if (request.getMedicineId() == null && request.getNewMedicineName() != null) {
            medicine = new Medicine();
            medicine.setName(request.getNewMedicineName());
            if (request.getNewMedicineCategory() != null) {
                medicine.setCategory(com.medical.om.om_backend.entity.Catagories.valueOf(request.getNewMedicineCategory()));
            }
            if (request.getNewMedicineDescription() != null) {
                medicine.setDescription(request.getNewMedicineDescription());
            }
            if (request.getBatch() != null) medicine.setBatch(request.getBatch());
            if (request.getManufacturing_date() != null) medicine.setManufacturing_date(java.time.LocalDate.parse(request.getManufacturing_date()));
            if (request.getExpiration_date() != null) medicine.setExpiration_date(java.time.LocalDate.parse(request.getExpiration_date()));
            medicine = medicineRepository.save(medicine);
        } else {
            medicine = medicineRepository.findById(request.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));
        }
        SalesPurchase record = new SalesPurchase();
        record.setMedicine(medicine);
        record.setMedicine_name(medicine.getName());
        record.setQuantity(request.getQuantity());
        record.setAmount(request.getAmount());
        if (request.getDate() != null) record.setDate(java.time.LocalDate.parse(request.getDate()));
        record.setType(request.getType());
        record.setBatch(request.getBatch());
        String supplierName = null;
        if (request.getSupplierId() != null) {
            Suppliers supplier = supplierRepository.findById(request.getSupplierId()).orElse(null);
            record.setSupplier(supplier);
            supplierName = supplier != null ? supplier.getName() : null;
        }
        if (request.getManufacturing_date() != null) record.setManufacturing_date(java.time.LocalDate.parse(request.getManufacturing_date()));
        if (request.getExpiration_date() != null) record.setExpiration_date(java.time.LocalDate.parse(request.getExpiration_date()));
        record = salesPurchaseRepository.save(record);
        int delta = "PURCHASE".equals(request.getType()) ? request.getQuantity() : -request.getQuantity();
        adjustInventory(medicine, request.getBatch(), delta, supplierName,
            request.getManufacturing_date() != null ? java.time.LocalDate.parse(request.getManufacturing_date()) : null,
            request.getExpiration_date() != null ? java.time.LocalDate.parse(request.getExpiration_date()) : null);
        return ResponseEntity.ok(record);
    }

    @PutMapping("/sales/{id}")
    public ResponseEntity<?> updateSalesPurchase(@PathVariable Long id, @RequestBody SalesPurchaseDto request) {
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        return salesPurchaseRepository.findById(id).map(record -> {
            record.setMedicine(medicine);
            record.setMedicine_name(medicine.getName());
            record.setQuantity(request.getQuantity());
            record.setAmount(request.getAmount());
            if (request.getDate() != null) record.setDate(java.time.LocalDate.parse(request.getDate()));
            record.setType(request.getType());
            record.setBatch(request.getBatch());
            if (request.getSupplierId() != null) {
                Suppliers supplier = supplierRepository.findById(request.getSupplierId()).orElse(null);
                record.setSupplier(supplier);
            }
            if (request.getManufacturing_date() != null) record.setManufacturing_date(java.time.LocalDate.parse(request.getManufacturing_date()));
            if (request.getExpiration_date() != null) record.setExpiration_date(java.time.LocalDate.parse(request.getExpiration_date()));
            return ResponseEntity.ok(salesPurchaseRepository.save(record));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/sales/{id}")
    public ResponseEntity<?> deleteSalesPurchase(@PathVariable Long id) {
        SalesPurchase record = salesPurchaseRepository.findById(id).orElse(null);
        if (record != null) {
            int delta = "PURCHASE".equals(record.getType()) ? -record.getQuantity() : record.getQuantity();
            adjustInventory(record.getMedicine(), record.getBatch(), delta,
                record.getSupplier() != null ? record.getSupplier().getName() : null,
                record.getManufacturing_date(), record.getExpiration_date());
        }
        salesPurchaseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
