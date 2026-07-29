package com.medistock.demo.controller;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.repository.MedicineRepository;
import com.medistock.demo.repository.SupplierRepository;
import com.medistock.demo.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {


    private final MedicineRepository medicineRepository;

    private final SupplierRepository supplierRepository;

    private final UserRepository userRepository;


    public DashboardController(

            MedicineRepository medicineRepository,

            SupplierRepository supplierRepository,

            UserRepository userRepository

    ) {

        this.medicineRepository = medicineRepository;

        this.supplierRepository = supplierRepository;

        this.userRepository = userRepository;

    }


    // =========================================================
    // COMMON DASHBOARD SUMMARY
    // ADMIN + PHARMACIST + STAFF
    // =========================================================

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {


        Map<String, Object> response = new HashMap<>();


        LocalDate today = LocalDate.now();

        LocalDate next30Days = today.plusDays(30);


        // ==========================
        // TOTAL MEDICINES
        // ==========================

        long totalMedicines =
                medicineRepository.count();


        // ==========================
        // TOTAL STOCK
        // ==========================

        Long totalStock =
                medicineRepository.getTotalStock();


        // ==========================
        // LOW STOCK
        // ==========================

        long lowStockCount =
                medicineRepository.countLowStockMedicines();


        List<Medicine> lowStockMedicines =
                medicineRepository.findLowStockMedicines();


        // ==========================
        // EXPIRED
        // ==========================

        List<Medicine> expiredMedicines =
                medicineRepository.findByExpiryDateBefore(today);


        long expiredCount =
                medicineRepository.countByExpiryDateBefore(today);


        // ==========================
        // NEAR EXPIRY
        // ==========================

        List<Medicine> nearExpiryMedicines =
                medicineRepository.findNearExpiry(
                        today,
                        next30Days
                );


        // ==========================
        // INVENTORY VALUE
        // ==========================

        Double totalStockValue =
                medicineRepository.getTotalStockValue();


        // ==========================
        // RESPONSE
        // ==========================

        response.put(
                "totalMedicines",
                totalMedicines
        );


        response.put(
                "totalStock",
                totalStock != null ? totalStock : 0
        );


        response.put(
                "totalSuppliers",
                supplierRepository.count()
        );


        response.put(
                "totalUsers",
                userRepository.count()
        );


        response.put(
                "lowStockCount",
                lowStockCount
        );


        response.put(
                "lowStockMedicines",
                lowStockMedicines
        );


        response.put(
                "expiredMedicines",
                expiredMedicines
        );


        response.put(
                "expiredCount",
                expiredCount
        );


        response.put(
                "nearExpiryMedicines",
                nearExpiryMedicines
        );


        response.put(
                "nearExpiryCount",
                nearExpiryMedicines.size()
        );


        response.put(
                "totalStockValue",
                totalStockValue != null
                        ? totalStockValue
                        : 0
        );


        // Sales can be connected later
        response.put(
                "salesToday",
                0
        );


        // Notifications can be connected to
        // NotificationRepository later
        response.put(
                "notifications",
                0
        );


        return response;

    }


    // =========================================================
    // LOW STOCK
    // =========================================================

    @GetMapping("/low-stock")
    public List<Medicine> lowStock() {

        return medicineRepository.findLowStockMedicines();

    }


    // =========================================================
    // EXPIRY ALERTS
    // =========================================================

    @GetMapping("/expiry-alerts")
    public List<Medicine> expiryAlerts() {


        LocalDate today =
                LocalDate.now();


        LocalDate next30Days =
                today.plusDays(30);


        return medicineRepository.findNearExpiry(
                today,
                next30Days
        );

    }


    // =========================================================
    // EXPIRED
    // =========================================================

    @GetMapping("/expired")
    public List<Medicine> expired() {

        return medicineRepository.findByExpiryDateBefore(
                LocalDate.now()
        );

    }

}