package com.medical.om.om_backend.service;

import com.medical.om.om_backend.entity.Inventory;
import com.medical.om.om_backend.entity.SalesPurchase;
import com.medical.om.om_backend.repository.InventoryRepository;
import com.medical.om.om_backend.repository.MedicineRepository;
import com.medical.om.om_backend.repository.SalesPurchaseRepository;
import com.medical.om.om_backend.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final SalesPurchaseRepository salesPurchaseRepository;
    private final InventoryCleanupService cleanupService;

    public DashboardService(MedicineRepository medicineRepository,
                            InventoryRepository inventoryRepository,
                            SupplierRepository supplierRepository,
                            SalesPurchaseRepository salesPurchaseRepository,
                            InventoryCleanupService cleanupService) {
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.salesPurchaseRepository = salesPurchaseRepository;
        this.cleanupService = cleanupService;
    }

    public Map<String, Object> getCommonStats() {
        cleanupService.cleanup();
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
        stats.put("profitSales", getProfitSales(6));
        return stats;
    }

    // Last N months of Sales revenue vs Profit (Sales amount - Purchase cost).
    public List<Map<String, Object>> getProfitSales(int months) {
        Map<String, double[]> byMonth = new HashMap<>();
        for (SalesPurchase sp : salesPurchaseRepository.findAll()) {
            if (sp.getDate() == null) continue;
            String key = sp.getDate().getYear() + "-" + String.format("%02d", sp.getDate().getMonthValue());
            double[] bucket = byMonth.computeIfAbsent(key, k -> new double[2]);
            if ("SALE".equalsIgnoreCase(sp.getType())) bucket[0] += sp.getAmount();
            else if ("PURCHASE".equalsIgnoreCase(sp.getType())) bucket[1] += sp.getAmount();
        }

        YearMonth now = YearMonth.now();
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = months - 1; i >= 0; i--) {
            YearMonth ym = now.minusMonths(i);
            String key = ym.getYear() + "-" + String.format("%02d", ym.getMonthValue());
            double[] bucket = byMonth.getOrDefault(key, new double[0]);
            double sales = bucket.length > 0 ? bucket[0] : 0;
            double purchases = bucket.length > 0 ? bucket[1] : 0;
            Map<String, Object> m = new HashMap<>();
            m.put("month", key);
            m.put("label", ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + ym.getYear());
            m.put("sales", Math.round(sales * 100.0) / 100.0);
            m.put("purchases", Math.round(purchases * 100.0) / 100.0);
            m.put("profit", Math.round((sales - purchases) * 100.0) / 100.0);
            result.add(m);
        }
        return result;
    }
}
