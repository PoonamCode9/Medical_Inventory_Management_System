package com.medistock.api.services;

import com.medistock.api.dto.AnalyticsDTO;
import com.medistock.api.models.Medicine;
import com.medistock.api.models.StockLog;
import com.medistock.api.models.StockMovementType;
import com.medistock.api.repositories.MedicineRepository;
import com.medistock.api.repositories.PurchaseOrderRepository;
import com.medistock.api.repositories.StockLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final MedicineRepository medicineRepository;
    private final StockLogRepository stockLogRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public AnalyticsService(MedicineRepository medicineRepository,
                            StockLogRepository stockLogRepository,
                            PurchaseOrderRepository purchaseOrderRepository) {
        this.medicineRepository = medicineRepository;
        this.stockLogRepository = stockLogRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    /**
     * Returns a fully aggregated analytics snapshot for the Reports page.
     * Includes inventory counters, stock movements, inventory value,
     * category/supplier breakdowns, top low-stock items, and a 7-day daily trend.
     */
    public AnalyticsDTO getInventoryAnalytics() {
        LocalDate today       = LocalDate.now();
        LocalDate expiryWindow = today.plusDays(30);

        AnalyticsDTO dto = new AnalyticsDTO();

        // ── Inventory counters ─────────────────────────────────────────────────
        dto.setTotalMedicines(medicineRepository.count());
        dto.setLowStockCount(medicineRepository.countByQuantityLessThanEqual(10));
        dto.setExpiringCount(medicineRepository.countExpiringBetween(today, expiryWindow));
        dto.setExpiredCount(medicineRepository.countByExpiryDateBefore(today));

        // ── Total inventory value (price × quantity) ───────────────────────────
        Double invValue = medicineRepository.sumInventoryValue();
        dto.setTotalInventoryValue(invValue != null ? invValue : 0.0);

        // ── Stock movement totals ──────────────────────────────────────────────
        Long inTotal  = stockLogRepository.sumQuantityByMovementType(StockMovementType.IN);
        Long outTotal = stockLogRepository.sumQuantityByMovementType(StockMovementType.OUT);
        dto.setTotalStockIn(inTotal  != null ? inTotal  : 0L);
        dto.setTotalStockOut(outTotal != null ? outTotal : 0L);

        // ── Purchase Order stats ───────────────────────────────────────────────
        dto.setTotalPurchaseOrders(purchaseOrderRepository.count());
        dto.setPendingOrders(purchaseOrderRepository.countByStatus(com.medistock.api.models.PurchaseOrderStatus.PENDING));
        dto.setReceivedOrders(purchaseOrderRepository.countByStatus(com.medistock.api.models.PurchaseOrderStatus.RECEIVED));
        
        Double poSpend = purchaseOrderRepository.sumAllTotalAmount();
        dto.setTotalPurchaseSpend(poSpend != null ? poSpend : 0.0);

        // ── Category breakdown ─────────────────────────────────────────────────
        List<Object[]> rawCategories = medicineRepository.countByCategory();
        List<AnalyticsDTO.CategoryStat> categoryBreakdown = rawCategories.stream()
                .map(row -> new AnalyticsDTO.CategoryStat(
                        row[0] != null ? (String) row[0] : "Uncategorized",
                        ((Number) row[1]).longValue()
                ))
                .sorted(Comparator.comparingLong(AnalyticsDTO.CategoryStat::getCount).reversed())
                .collect(Collectors.toList());
        dto.setCategoryBreakdown(categoryBreakdown);

        // ── Supplier breakdown ─────────────────────────────────────────────────
        List<Object[]> rawSuppliers = medicineRepository.countBySupplier();
        List<AnalyticsDTO.SupplierStat> supplierBreakdown = rawSuppliers.stream()
                .map(row -> new AnalyticsDTO.SupplierStat(
                        row[0] != null ? (String) row[0] : "No Supplier",
                        ((Number) row[1]).longValue()
                ))
                .sorted(Comparator.comparingLong(AnalyticsDTO.SupplierStat::getCount).reversed())
                .collect(Collectors.toList());
        dto.setSupplierBreakdown(supplierBreakdown);

        // ── Top low-stock items (worst 8) ──────────────────────────────────────
        List<Medicine> lowStockMeds = medicineRepository.findTopLowStock(10, PageRequest.of(0, 8));
        List<AnalyticsDTO.LowStockItem> topLowStock = lowStockMeds.stream()
                .map(m -> new AnalyticsDTO.LowStockItem(
                        m.getId(),
                        m.getName(),
                        m.getQuantity(),
                        m.getCategory() != null ? m.getCategory().getName() : "Uncategorized"
                ))
                .collect(Collectors.toList());
        dto.setTopLowStockItems(topLowStock);

        // ── 7-day daily movement trend ─────────────────────────────────────────
        LocalDateTime since = today.minusDays(6).atStartOfDay();
        List<StockLog> recentLogs = stockLogRepository.findAllSince(since);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        // Build map day -> [in, out]
        Map<String, long[]> dayMap = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            dayMap.put(today.minusDays(i).format(fmt), new long[]{0L, 0L});
        }
        for (StockLog log : recentLogs) {
            String day = log.getTimestamp().toLocalDate().format(fmt);
            if (dayMap.containsKey(day)) {
                if (log.getMovementType() == StockMovementType.IN) {
                    dayMap.get(day)[0] += log.getQuantity();
                } else {
                    dayMap.get(day)[1] += log.getQuantity();
                }
            }
        }

        List<AnalyticsDTO.DailyMovement> dailyMovements = dayMap.entrySet().stream()
                .map(e -> new AnalyticsDTO.DailyMovement(e.getKey(), e.getValue()[0], e.getValue()[1]))
                .collect(Collectors.toList());
        dto.setDailyMovements(dailyMovements);

        return dto;
    }
}
