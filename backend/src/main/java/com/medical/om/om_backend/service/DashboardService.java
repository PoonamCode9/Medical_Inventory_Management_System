package com.medical.om.om_backend.service;

import com.medical.om.om_backend.entity.Inventory;
import com.medical.om.om_backend.repository.InventoryRepository;
import com.medical.om.om_backend.repository.MedicineRepository;
import com.medical.om.om_backend.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;

    public DashboardService(MedicineRepository medicineRepository,
                            InventoryRepository inventoryRepository,
                            SupplierRepository supplierRepository) {
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
    }

    public Map<String, Object> getCommonStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMedicines", medicineRepository.count());
        stats.put("totalInventoryItems", inventoryRepository.count());
        stats.put("totalSuppliers", supplierRepository.count());
        stats.put("recentMedicines", medicineRepository.findTop5ByOrderByIdDesc());
        stats.put("recentInventoryItems", inventoryRepository.findTop5ByOrderByIdDesc());
        stats.put("recentSuppliers", supplierRepository.findTop5ByOrderByIdDesc());

        List<Inventory> allInv = inventoryRepository.findAll();
        Map<String, Long> stockByMedicine = allInv.stream()
            .collect(Collectors.groupingBy(
                i -> i.getMedicine() != null ? i.getMedicine().getName() : "Unknown",
                Collectors.summingLong(Inventory::getAvailable_qty)
            ));
        List<Map<String, Object>> pieData = stockByMedicine.entrySet().stream()
            .map(e -> { Map<String, Object> m = new HashMap<>(); m.put("name", e.getKey()); m.put("value", e.getValue()); return m; })
            .sorted((a, b) -> Long.compare((Long) b.get("value"), (Long) a.get("value")))
            .collect(Collectors.toList());
        stats.put("stockByMedicine", pieData);
        stats.put("totalStock", allInv.stream().mapToLong(Inventory::getAvailable_qty).sum());
        return stats;
    }
}
