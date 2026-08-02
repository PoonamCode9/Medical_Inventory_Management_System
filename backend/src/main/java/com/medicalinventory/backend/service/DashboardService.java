package com.medicalinventory.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.dto.DashboardStatsDTO;
import com.medicalinventory.backend.dto.LowStockAlertDTO;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.repository.InventoryRepository;
import com.medicalinventory.backend.repository.MedicineRepository;
import com.medicalinventory.backend.repository.SupplierRepository;
import com.medicalinventory.backend.repository.UserRepository;


@Service
public class DashboardService {
    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;

    public DashboardService(
            MedicineRepository medicineRepository, 
            SupplierRepository supplierRepository, 
            UserRepository userRepository, 
            InventoryRepository inventoryRepository) {
        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public DashboardStatsDTO getStats() {
        long medicines = medicineRepository.count();
        long suppliers = supplierRepository.count();
        long users = userRepository.count();
        long lowStock = inventoryRepository.countByQuantityGreaterThanAndQuantityLessThan(0, 20);
        long outOfStock = inventoryRepository.countByQuantityEquals(0);

        return new DashboardStatsDTO(medicines, suppliers, users, lowStock, outOfStock);
    }

    
    // Fetch Low Stock Items (Quantity <= 20)
    public List<LowStockAlertDTO> getLowStockAlerts() {
        List<Inventory> lowStockList = inventoryRepository.findAll().stream()
                .filter(inv -> inv.getQuantity() != null && (inv.getQuantity() > 0 && inv.getQuantity() <= 20))
                .sorted((a, b) -> Integer.compare(a.getQuantity(), b.getQuantity()))
                .toList();

        return lowStockList.stream().map(inv -> new LowStockAlertDTO(
                inv.getMedicine().getMedicineId(),
                inv.getMedicine().getMedicineName(),
                inv.getMedicine().getBatchNo(),
                inv.getQuantity(),
                inv.getInventoryId()
        )).toList();
    }
}