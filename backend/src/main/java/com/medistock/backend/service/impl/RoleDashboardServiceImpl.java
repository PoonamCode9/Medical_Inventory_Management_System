package com.medistock.backend.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.Notification;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.entity.StockLog;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.StockLogRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.RoleDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleDashboardServiceImpl implements RoleDashboardService {

    private static final int LOW_STOCK_THRESHOLD = 20;
    private static final int EXPIRY_WINDOW_DAYS = 30;

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final StockLogRepository stockLogRepository;

    private List<Map<String, Object>> buildSupplierAnalyticsForAdmin(
        List<Supplier> suppliers,
        List<PurchaseOrder> orders) {

    List<Map<String, Object>> result = new ArrayList<>();

    for (Supplier s : suppliers) {

        List<PurchaseOrder> supplierOrders =
                orders.stream()
                        .filter(o ->
                                o.getSupplier() != null &&
                                o.getSupplier()
                                        .getSupplierId()
                                        .equals(s.getSupplierId()))
                        .collect(Collectors.toList());

        LocalDate lastOrder =
                supplierOrders.stream()
                        .map(PurchaseOrder::getPurchaseDate)
                        .filter(Objects::nonNull)
                        .max(LocalDate::compareTo)
                        .orElse(null);

        long orderCount = supplierOrders.size();

        /*
         * Your database currently does NOT have a delivery date
         * or expected delivery date.
         *
         * Therefore we cannot calculate a real on-time percentage.
         *
         * Returning "—" is safer than inventing a percentage.
         */

        result.add(
                mapOf(
                        "supplier",
                        s.getSupplierName(),

                        "orders",
                        orderCount,

                        "onTime",
                        "—",

                        "lastOrder",
                        lastOrder != null
                                ? lastOrder.toString()
                                : "—"
                )
        );
    }

    return result;
}

    // ==========================================================
    // ADMIN
    // ==========================================================

   @Override
public Map<String, Object> getAdminDashboard() {

    Map<String, Object> data = new LinkedHashMap<>();

    List<Medicine> medicines = medicineRepository.findAll();
    List<Inventory> inventories = inventoryRepository.findAll();
    List<PurchaseOrder> orders = purchaseOrderRepository.findAll();
    List<Supplier> suppliers = supplierRepository.findAll();
    List<Notification> notifications = notificationRepository.findAll();
    List<StockLog> logs = stockLogRepository.findAll();

    LocalDate today = LocalDate.now();
    LocalDate expiryWindowEnd = today.plusDays(EXPIRY_WINDOW_DAYS);

    // ==========================================================
    // KPI CARDS
    // ==========================================================

    data.put("users", userRepository.count());

    data.put("medicines", (long) medicines.size());

    data.put("suppliers", (long) suppliers.size());

    data.put("inventory", (long) inventories.size());

    data.put(
            "lowStock",
            medicines.stream()
                    .filter(m ->
                            m.getQuantity() != null &&
                            m.getQuantity() <= LOW_STOCK_THRESHOLD)
                    .count()
    );

    data.put(
            "expiryAlerts",
            medicines.stream()
                    .filter(m ->
                            inExpiryWindow(
                                    m,
                                    today,
                                    expiryWindowEnd
                            ))
                    .count()
    );

    // ==========================================================
    // LOW STOCK ITEMS
    // ==========================================================

    data.put(
            "lowStockItems",
            buildLowStockItemsWithReorder(medicines)
    );

    // ==========================================================
    // EXPIRING MEDICINES
    // ==========================================================

    data.put(
            "expiringMedicines",
            buildExpiringMedicinesWithDaysLeft(
                    medicines,
                    today,
                    expiryWindowEnd
            )
    );

    // ==========================================================
    // INVENTORY ANALYTICS
    // ==========================================================

    data.put(
            "inventoryByCategory",
            buildCategoryBreakdown(medicines)
    );

    // ==========================================================
    // SUPPLIER ANALYTICS
    // ==========================================================

    data.put(
            "supplierAnalytics",
            buildSupplierAnalyticsForAdmin(
                    suppliers,
                    orders
            )
    );

    // ==========================================================
    // STOCK MOVEMENT REPORTS
    // ==========================================================

    data.put(
            "stockMovements",
            logs.stream()
                    .sorted(
                            Comparator.comparing(
                                    StockLog::getTransactionDate,
                                    Comparator.nullsLast(
                                            Comparator.reverseOrder()
                                    )
                            )
                    )
                    .limit(8)
                    .map(this::stockLogToMovementMap)
                    .collect(Collectors.toList())
    );

    // ==========================================================
    // PURCHASE SUMMARY
    // Same type of data used by Pharmacist Dashboard
    // ==========================================================

    data.put(
            "purchaseSummary",
            orders.stream()
                    .sorted(
                            Comparator.comparing(
                                    PurchaseOrder::getPurchaseDate,
                                    Comparator.nullsLast(
                                            Comparator.reverseOrder()
                                    )
                            )
                    )
                    .limit(6)
                    .map(this::purchaseOrderToSummaryMap)
                    .collect(Collectors.toList())
    );

    // ==========================================================
    // USER ACTIVITY
    // ==========================================================

    data.put(
            "userActivity",
            notifications.stream()
                    .sorted(
                            Comparator.comparing(
                                    Notification::getCreatedAt,
                                    Comparator.nullsLast(
                                            Comparator.reverseOrder()
                                    )
                            )
                    )
                    .limit(8)
                    .map(n -> mapOf(
                            "user",
                            n.getUser() != null
                                    ? n.getUser().getFullName()
                                    : "System",

                            "role",
                            n.getUser() != null &&
                            n.getUser().getRole() != null
                                    ? n.getUser()
                                        .getRole()
                                        .getRoleName()
                                    : "—",

                            "action",
                            n.getMessage(),

                            "time",
                            n.getCreatedAt() != null
                                    ? n.getCreatedAt()
                                        .format(
                                            DateTimeFormatter.ofPattern(
                                                "MMM d, HH:mm"
                                            )
                                        )
                                    : "—"
                    ))
                    .collect(Collectors.toList())
    );

    // ==========================================================
    // SYSTEM STATUS
    // ==========================================================

    List<Map<String, Object>> systemStatus =
            new ArrayList<>();

    systemStatus.add(
            mapOf(
                    "label",
                    "API",
                    "status",
                    "Operational"
            )
    );

    systemStatus.add(
            mapOf(
                    "label",
                    "Database",
                    "status",
                    "Operational"
            )
    );

    systemStatus.add(
            mapOf(
                    "label",
                    "Last Refreshed",
                    "status",
                    java.time.LocalTime.now()
                            .format(
                                DateTimeFormatter.ofPattern(
                                    "HH:mm:ss"
                                )
                            )
            )
    );

    data.put("systemStatus", systemStatus);

    return data;
}
  
    // ==========================================================
    // PHARMACIST
    // ==========================================================

    @Override
    public Map<String, Object> getPharmacistDashboard(Integer userId) {

        Map<String, Object> data = new HashMap<>();

        List<Medicine> medicines = medicineRepository.findAll();
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();
        List<Supplier> suppliers = supplierRepository.findAll();

        LocalDate today = LocalDate.now();
        LocalDate expiryWindowEnd = today.plusDays(EXPIRY_WINDOW_DAYS);

        long totalStock = medicines.stream()
                .map(Medicine::getQuantity)
                .filter(Objects::nonNull)
                .mapToLong(Integer::longValue)
                .sum();

        data.put("availableMedicines", (long) medicines.size());
        data.put("stockAvailable", totalStock);
        data.put("lowStock", medicines.stream()
                .filter(m -> m.getQuantity() != null && m.getQuantity() <= LOW_STOCK_THRESHOLD)
                .count());
        data.put("expiryAlerts", medicines.stream()
                .filter(m -> inExpiryWindow(m, today, expiryWindowEnd))
                .count());
        data.put("notifications", notificationRepository.countByIsReadFalse());

        data.put("lowStockItems", buildLowStockItemsWithReorder(medicines));
        data.put("expiringMedicines", buildExpiringMedicinesWithDaysLeft(medicines, today, expiryWindowEnd));

        data.put("purchaseSummary",
                orders.stream()
                        .sorted(Comparator.comparing(PurchaseOrder::getPurchaseDate,
                                Comparator.nullsLast(Comparator.reverseOrder())))
                        .limit(6)
                        .map(this::purchaseOrderToSummaryMap)
                        .collect(Collectors.toList()));

        data.put("supplierInsights", buildSupplierInsights(suppliers, medicines, orders));

        if (userId != null) {
            data.put("notificationsList",
                    notificationRepository.findByUser_UserId(userId).stream()
                            .sorted(Comparator.comparing(Notification::getCreatedAt,
                                    Comparator.nullsLast(Comparator.reverseOrder())))
                            .limit(6)
                            .map(n -> mapOf(
                                    "message", n.getMessage(),
                                    "time", n.getCreatedAt() != null
                                            ? n.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM d, HH:mm"))
                                            : "—"
                            ))
                            .collect(Collectors.toList()));
        } else {
            // No userId passed — return an empty list rather than guessing whose
            // notifications to show. Frontend should send ?userId= once the
            // logged-in user's id is available (see LoginResponse.userId).
            data.put("notificationsList", Collections.emptyList());
        }

        return data;
    }

    // ==========================================================
    // STAFF
    // ==========================================================

    @Override
    public Map<String, Object> getStaffDashboard() {

        Map<String, Object> data = new HashMap<>();

        List<Medicine> medicines = medicineRepository.findAll();
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();
        List<StockLog> logs = stockLogRepository.findAll();

        data.put("inventory", inventoryRepository.count());
        data.put("suppliers", supplierRepository.count());
        data.put("purchaseOrders", (long) orders.size());
        data.put("stockLogs", (long) logs.size());
        data.put("lowStockItems", buildLowStockItemsWithReorder(medicines));

data.put("expiringMedicines",
        buildExpiringMedicinesWithDaysLeft(
                medicines,
                LocalDate.now(),
                LocalDate.now().plusDays(EXPIRY_WINDOW_DAYS)
        ));

        // Full medicine list for the scan & search table — the frontend already
        // filters this client-side. Fine for now; consider paginating server-side
        // once the catalog grows large.
        data.put("medicines",
                medicines.stream()
                        .map(m -> mapOf(
                                "medicine", m.getMedicineName(),
                                "batch", m.getBatchNumber(),
                                "qty", m.getQuantity(),
                                "status", stockStatus(m.getQuantity())
                        ))
                        .collect(Collectors.toList()));

        data.put("recentStockLogs",
                logs.stream()
                        .sorted(Comparator.comparing(StockLog::getTransactionDate,
                                Comparator.nullsLast(Comparator.reverseOrder())))
                        .limit(8)
                        .map(this::stockLogToRecentMap)
                        .collect(Collectors.toList()));

        data.put("purchaseOrdersList",
                orders.stream()
                        .sorted(Comparator.comparing(PurchaseOrder::getPurchaseDate,
                                Comparator.nullsLast(Comparator.reverseOrder())))
                        .limit(8)
                        .map(po -> mapOf(
                                "orderId", "PO-" + po.getPurchaseId(),
                                "supplier", po.getSupplier() != null ? po.getSupplier().getSupplierName() : "—",
                                "status", po.getStatus(),
                                // NOTE: there's no distinct "expected delivery date" field —
                                // this schema only has purchaseDate, so that's what's shown.
                                "expected", po.getPurchaseDate() != null ? po.getPurchaseDate().toString() : "—"
                        ))
                        .collect(Collectors.toList()));

        data.put("lowStockAlertsList", buildLowStockList(medicines));

        return data;
    }

    // ==========================================================
    // Shared helpers
    // ==========================================================

    private boolean inExpiryWindow(Medicine m, LocalDate today, LocalDate windowEnd) {
        if (m.getExpiryDate() == null) return false;
        return !m.getExpiryDate().isBefore(today) && !m.getExpiryDate().isAfter(windowEnd);
    }

    private List<Map<String, Object>> buildCategoryBreakdown(List<Medicine> medicines) {

        Map<String, long[]> agg = new LinkedHashMap<>(); // [count, stock]

        for (Medicine m : medicines) {
            String cat = m.getCategory() == null ? "Uncategorized" : m.getCategory();
            agg.computeIfAbsent(cat, k -> new long[2]);
            agg.get(cat)[0] += 1;
            agg.get(cat)[1] += m.getQuantity() == null ? 0L : m.getQuantity().longValue();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        agg.forEach((cat, vals) -> result.add(mapOf("category", cat, "count", vals[0], "stock", vals[1])));
        return result;
    }

    private List<Map<String, Object>> buildSupplierAnalytics(List<Supplier> suppliers, List<PurchaseOrder> orders) {

        List<Map<String, Object>> result = new ArrayList<>();

        for (Supplier s : suppliers) {

            List<PurchaseOrder> supplierOrders = orders.stream()
                    .filter(o -> o.getSupplier() != null
                            && o.getSupplier().getSupplierId().equals(s.getSupplierId()))
                    .collect(Collectors.toList());

            LocalDate lastOrder = supplierOrders.stream()
                    .map(PurchaseOrder::getPurchaseDate)
                    .filter(Objects::nonNull)
                    .max(LocalDate::compareTo)
                    .orElse(null);

            result.add(mapOf(
                    "supplier", s.getSupplierName(),
                    "orders", supplierOrders.size(),
                    "lastOrder", lastOrder != null ? lastOrder.toString() : "—"
            ));
        }

        return result;
    }

    private List<Map<String, Object>> buildLowStockList(List<Medicine> medicines) {
        return medicines.stream()
                .filter(m -> m.getQuantity() != null && m.getQuantity() <= LOW_STOCK_THRESHOLD)
                .map(m -> mapOf("medicine", m.getMedicineName(), "batch", m.getBatchNumber(), "qty", m.getQuantity()))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildExpiringList(List<Medicine> medicines, LocalDate today, LocalDate windowEnd) {

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM/yyyy");

        return medicines.stream()
                .filter(m -> inExpiryWindow(m, today, windowEnd))
                .map(m -> mapOf(
                        "medicine", m.getMedicineName(),
                        "batch", m.getBatchNumber(),
                        "expires", m.getExpiryDate().format(fmt)
                ))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildLowStockItemsWithReorder(List<Medicine> medicines) {

        Map<Integer, Inventory> byMedicineId = inventoryRepository.findAll().stream()
                .filter(inv -> inv.getMedicine() != null)
                .collect(Collectors.toMap(
                        inv -> inv.getMedicine().getMedicineId(),
                        inv -> inv,
                        (a, b) -> a));

        return medicines.stream()
                .filter(m -> m.getQuantity() != null && m.getQuantity() <= LOW_STOCK_THRESHOLD)
                .map(m -> {
                    Inventory inv = byMedicineId.get(m.getMedicineId());
                    Integer minStock = inv != null ? inv.getMinimumStock() : null;
                    int reorderLevel = minStock != null ? minStock : LOW_STOCK_THRESHOLD;
                    return mapOf(
                            "medicine", m.getMedicineName(),
                            "batch", m.getBatchNumber(),
                            "qty", m.getQuantity(),
                            "reorderLevel", reorderLevel
                    );
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildExpiringMedicinesWithDaysLeft(
            List<Medicine> medicines, LocalDate today, LocalDate windowEnd) {

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM/yyyy");

        return medicines.stream()
                .filter(m -> inExpiryWindow(m, today, windowEnd))
                .map(m -> mapOf(
                        "medicine", m.getMedicineName(),
                        "batch", m.getBatchNumber(),
                        "expires", m.getExpiryDate().format(fmt),
                        "daysLeft", ChronoUnit.DAYS.between(today, m.getExpiryDate())
                ))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildSupplierInsights(
            List<Supplier> suppliers, List<Medicine> medicines, List<PurchaseOrder> orders) {

        List<Map<String, Object>> result = new ArrayList<>();

        for (Supplier s : suppliers) {

            long medicinesSupplied = medicines.stream()
                    .filter(m -> m.getSupplier() != null
                            && m.getSupplier().getSupplierId().equals(s.getSupplierId()))
                    .count();

            LocalDate lastOrder = orders.stream()
                    .filter(o -> o.getSupplier() != null
                            && o.getSupplier().getSupplierId().equals(s.getSupplierId()))
                    .map(PurchaseOrder::getPurchaseDate)
                    .filter(Objects::nonNull)
                    .max(LocalDate::compareTo)
                    .orElse(null);

            result.add(mapOf(
                    "supplier", s.getSupplierName(),
                    "medicinesSupplied", medicinesSupplied,
                    "lastOrder", lastOrder != null ? lastOrder.toString() : "—",
                    // Not a fabricated performance rating — just reflects whether
                    // we have any medicines on file from them yet.
                    "status", medicinesSupplied > 0 ? "Active" : "No medicines yet"
            ));
        }

        return result;
    }

    private Map<String, Object> purchaseOrderToSummaryMap(PurchaseOrder po) {

        BigDecimal amount = (po.getMedicine() != null && po.getMedicine().getPrice() != null)
                ? po.getMedicine().getPrice().multiply(BigDecimal.valueOf(po.getQuantity()))
                : BigDecimal.ZERO;

        return mapOf(
                "orderId", "PO-" + po.getPurchaseId(),
                "supplier", po.getSupplier() != null ? po.getSupplier().getSupplierName() : "—",
                "date", po.getPurchaseDate() != null ? po.getPurchaseDate().toString() : "—",
                "status", po.getStatus(),
                "amount", "$" + amount.setScale(2, RoundingMode.HALF_UP)
        );
    }

    private Map<String, Object> stockLogToMovementMap(StockLog log) {

        String medicineName = "—";
        String batch = "—";

        try {
            medicineName = log.getInventory().getMedicine().getMedicineName();
            batch = log.getInventory().getMedicine().getBatchNumber();
        } catch (Exception ignored) {
            // inventory or medicine may have been deleted since the log was written
        }

        return mapOf(
                "date", log.getTransactionDate() != null ? log.getTransactionDate().toLocalDate().toString() : "—",
                "medicine", medicineName,
                "batch", batch,
                "type", log.getMovementType(),
                // NOTE: this is the resulting quantity at the time of the log, NOT a
                // signed delta — StockLogService currently logs the post-change
                // quantityAvailable for both ADD and UPDATE, so there's no reliable
                // "+/-" to compute here without changing what gets recorded.
                "qty", log.getQuantity(),
                // StockLog has no user/performedBy reference yet.
                "by", "—"
        );
    }

    private Map<String, Object> stockLogToRecentMap(StockLog log) {

        String medicineName = "—";

        try {
            medicineName = log.getInventory().getMedicine().getMedicineName();
        } catch (Exception ignored) {
        }

        return mapOf(
                "date", log.getTransactionDate() != null ? log.getTransactionDate().toLocalDate().toString() : "—",
                "medicine", medicineName,
                "change", log.getMovementType() + " → " + log.getQuantity(),
                "by", "—"
        );
    }

    private String stockStatus(Integer qty) {
        if (qty == null || qty == 0) return "Out of stock";
        if (qty <= LOW_STOCK_THRESHOLD) return "Low stock";
        return "In stock";
    }

    private Map<String, Object> mapOf(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) {
            m.put((String) kv[i], kv[i + 1]);
        }
        return m;
    }
}