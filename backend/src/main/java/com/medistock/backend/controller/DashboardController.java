package com.medistock.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.backend.dto.DashboardDTO;
import com.medistock.backend.repository.ExpiryTrackingRepository;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.StockLogRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final StockLogRepository stockLogRepository;
    private final ExpiryTrackingRepository expiryTrackingRepository;
    private final NotificationRepository notificationRepository;

@GetMapping

public Map<String, Object> getDashboardData() {

    Map<String, Object> data = new HashMap<>();

    data.put("users", userRepository.count());
    data.put("medicines", medicineRepository.count());
    data.put("suppliers", supplierRepository.count());
    data.put("inventory", inventoryRepository.count());
    data.put("purchaseOrders", purchaseOrderRepository.count());
    data.put("stockLogs", stockLogRepository.count());

        data.put("lowStock",
            inventoryRepository.countByQuantityAvailableLessThanEqualMinimumStock());

        data.put("expiryAlerts",
            expiryTrackingRepository.countByStatus("EXPIRING_SOON"));

        data.put("notifications",
            notificationRepository.countByUser_UserIdAndIsReadFalse(1));

    return data;
}
    // Admin Dashboard
    @GetMapping("/admin")
    public DashboardDTO getAdminDashboard() {
        return dashboardService.getAdminDashboard();
    }

    // Inventory Dashboard
    @GetMapping("/inventory")
    public DashboardDTO getInventoryDashboard() {
        return dashboardService.getInventoryDashboard();
    }

    // Pharmacist Dashboard
    @GetMapping("/pharmacist")
    public DashboardDTO getPharmacistDashboard() {
        return dashboardService.getPharmacistDashboard();
    }
    
}