package com.example.backend;

import com.example.backend.dto.ChartDataResponseDto;
import com.example.backend.dto.ChartDataResponseDto.CategoryDataPoint;
import com.example.backend.dto.ChartDataResponseDto.MonthlyDataPoint;
import com.example.backend.dto.DashboardKpiDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final MedicineRepository medicineRepository;
    private final DispenseItemRepository dispenseItemRepository;
    private final DispenseRepository dispenseRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public AdminDashboardController(MedicineRepository medicineRepository,
                                    DispenseItemRepository dispenseItemRepository,
                                    DispenseRepository dispenseRepository,
                                    PurchaseOrderRepository purchaseOrderRepository) {
        this.medicineRepository = medicineRepository;
        this.dispenseItemRepository = dispenseItemRepository;
        this.dispenseRepository = dispenseRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @GetMapping("/kpi")
    public ResponseEntity<DashboardKpiDto> getKpi() {
        List<Medicine> allMedicines = medicineRepository.findAll();
        List<DispenseItem> allDispenseItems = dispenseItemRepository.findAll();

        DashboardKpiDto dto = new DashboardKpiDto();

        // Total Medicines: count of unique medicine names
        dto.setTotalMedicines(allMedicines.stream()
                .map(Medicine::getName)
                .distinct()
                .count());

        // Current Stock Units: sum of all quantities
        dto.setCurrentStockUnits(allMedicines.stream()
                .mapToLong(m -> m.getQuantity() != null ? m.getQuantity() : 0L)
                .sum());

        // Inventory Value: sum of quantity * price
        BigDecimal inventoryValue = allMedicines.stream()
                .map(m -> {
                    BigDecimal qty = BigDecimal.valueOf(m.getQuantity() != null ? m.getQuantity() : 0);
                    BigDecimal price = m.getPrice() != null ? m.getPrice() : BigDecimal.ZERO;
                    return qty.multiply(price);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setInventoryValue(inventoryValue);

        // Low Stock Items: quantity <= 10
        dto.setLowStockItems(allMedicines.stream()
                .filter(m -> m.getQuantity() != null && m.getQuantity() <= 10)
                .count());

        // Expiring Soon: within next 30 days (including already expired)
        LocalDate today = LocalDate.now();
        LocalDate expireEnd = today.plusDays(30);
        dto.setExpiringSoon(allMedicines.stream()
                .filter(m -> m.getExpiryDate() != null && !m.getExpiryDate().isAfter(expireEnd))
                .count());

        // Monthly Purchases: total quantity dispensed overall
        dto.setMonthlyPurchases(allDispenseItems.stream()
                .mapToLong(di -> di.getQuantity() != null ? di.getQuantity() : 0L)
                .sum());

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/charts")
    public ResponseEntity<ChartDataResponseDto> getCharts() {
        ChartDataResponseDto dto = new ChartDataResponseDto();

        // ─── Monthly Dispenses vs Purchases ────────────────────
        Map<String, Long> dispenseMap = new LinkedHashMap<>();
        for (Object[] row : dispenseRepository.findMonthlyDispenseTotals()) {
            dispenseMap.put((String) row[0], ((Number) row[1]).longValue());
        }

        Map<String, Long> purchaseMap = new LinkedHashMap<>();
        for (Object[] row : purchaseOrderRepository.findMonthlyPurchaseTotals()) {
            purchaseMap.put((String) row[0], ((Number) row[1]).longValue());
        }

        // Merge all month keys
        Set<String> allMonths = new TreeSet<>();
        allMonths.addAll(dispenseMap.keySet());
        allMonths.addAll(purchaseMap.keySet());

        List<MonthlyDataPoint> monthlyData = new ArrayList<>();
        for (String month : allMonths) {
            monthlyData.add(new MonthlyDataPoint(
                    month,
                    dispenseMap.getOrDefault(month, 0L),
                    purchaseMap.getOrDefault(month, 0L)
            ));
        }
        dto.setMonthlyDispensesVsPurchases(monthlyData);

        // ─── Medicine Category Distribution ────────────────────
        List<CategoryDataPoint> categoryData = new ArrayList<>();
        for (Object[] row : medicineRepository.findCategoryDistribution()) {
            categoryData.add(new CategoryDataPoint((String) row[0], ((Number) row[1]).longValue()));
        }
        dto.setMedicineCategoryDistribution(categoryData);

        return ResponseEntity.ok(dto);
    }
}

