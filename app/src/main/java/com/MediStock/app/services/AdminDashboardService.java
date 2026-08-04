package com.MediStock.app.services;

import com.MediStock.app.dto.AdminDashboardSummary;
import com.MediStock.app.entities.Inventory;
import com.MediStock.app.repositories.InventoryRepository;
import com.MediStock.app.repositories.MedicineRepository;
import com.MediStock.app.repositories.SupplierRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class AdminDashboardService {

    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;

    public AdminDashboardService(MedicineRepository medicineRepository,
                                 SupplierRepository supplierRepository,
                                 InventoryRepository inventoryRepository) {

        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public AdminDashboardSummary getSummary() {

        long totalMedicines = medicineRepository.count();
        long totalSuppliers = supplierRepository.count();

        List<Inventory> inventoryList = inventoryRepository.findAll();

        long totalInventoryBatches = inventoryList.size();

        long totalInventoryUnits = inventoryList.stream()
        .mapToLong(inventory ->
                inventory.getQuantity() != null ? inventory.getQuantity() : 0)
        .sum();

        BigDecimal totalInventoryValue = inventoryList.stream()
        .map(inventory ->
                inventory.getMedicine()
                        .getPrice()
                        .multiply(BigDecimal.valueOf(inventory.getQuantity())))
        .reduce(BigDecimal.ZERO, (total, value) -> total.add(value));

        long lowStockMedicines = inventoryList.stream()
                .filter(inventory -> inventory.getQuantity() <= 10)
                .count();

        LocalDate today = LocalDate.now();
        LocalDate nextThirtyDays = today.plusDays(30);

        long expiringMedicines = inventoryList.stream()
                .filter(inventory ->
                        !inventory.getExpDate().isBefore(today)
                                && !inventory.getExpDate().isAfter(nextThirtyDays))
                .count();

        AdminDashboardSummary summary = new AdminDashboardSummary();

        summary.setTotalMedicines(totalMedicines);
        summary.setTotalSuppliers(totalSuppliers);
        summary.setTotalInventoryUnits(totalInventoryUnits);
        summary.setTotalInventoryBatches(totalInventoryBatches);
        summary.setTotalInventoryValue(totalInventoryValue);
        summary.setLowStockMedicines(lowStockMedicines);
        summary.setExpiringMedicines(expiringMedicines);

        // Placeholder values until these modules are implemented
        summary.setTotalPurchaseOrders(0);
        summary.setTotalNotifications(0);

        return summary;
    }

}