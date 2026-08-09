package com.medistock.backend.service.impl;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.LowStockSnapshot;
import com.medistock.backend.entity.Notification;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.entity.User;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.LowStockSnapshotRepository;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final int LOW_STOCK_THRESHOLD = 20;
    private static final int EXPIRY_WINDOW_DAYS = 30;

    private final MedicineRepository medicineRepository;
    private final LowStockSnapshotRepository lowStockSnapshotRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public Map<String, Object> getAnalytics() {

        Map<String, Object> data = new HashMap<>();

        List<Medicine> medicines = medicineRepository.findAll();
        List<Supplier> suppliers = supplierRepository.findAll();
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();
        List<Notification> notifications = notificationRepository.findAll();
        List<User> users = userRepository.findAll();

        LocalDate today = LocalDate.now();
        LocalDate expiryWindowEnd = today.plusDays(EXPIRY_WINDOW_DAYS);

        // ---------------- Inventory analytics ----------------
        data.put("totalMedicines", (long) medicines.size());
        data.put("totalStock", medicines.stream()
                .map(Medicine::getQuantity)
                .filter(Objects::nonNull)
                .mapToLong(Integer::longValue)
                .sum());
        data.put("lowStock", medicines.stream()
                .filter(m -> m.getQuantity() != null && m.getQuantity() > 0 && m.getQuantity() <= LOW_STOCK_THRESHOLD)
                .count());
        data.put("outOfStock", medicines.stream()
                .filter(m -> m.getQuantity() == null || m.getQuantity() == 0)
                .count());
        data.put("expiringSoon", medicines.stream()
                .filter(m -> m.getExpiryDate() != null
                        && !m.getExpiryDate().isBefore(today)
                        && !m.getExpiryDate().isAfter(expiryWindowEnd))
                .count());
        data.put("expired", medicines.stream()
                .filter(m -> m.getExpiryDate() != null && m.getExpiryDate().isBefore(today))
                .count());

        // ---------------- Purchase analytics ----------------
        data.put("totalPurchaseOrders", (long) orders.size());
        data.put("pendingOrders", orders.stream()
                .filter(o -> "PENDING".equalsIgnoreCase(o.getStatus()))
                .count());
        data.put("completedOrders", orders.stream()
                .filter(o -> "COMPLETED".equalsIgnoreCase(o.getStatus())
                        || "DELIVERED".equalsIgnoreCase(o.getStatus()))
                .count());

        YearMonth thisMonth = YearMonth.now();
        data.put("ordersThisMonth", orders.stream()
                .filter(o -> o.getPurchaseDate() != null && YearMonth.from(o.getPurchaseDate()).equals(thisMonth))
                .count());

        // ---------------- Supplier analytics ----------------
        data.put("totalSuppliers", (long) suppliers.size());
        data.put("mostActiveSupplier", mostActiveSupplier(suppliers, orders));

        // ---------------- Notification analytics ----------------
        data.put("totalNotifications", (long) notifications.size());
        data.put("lowStockAlerts", notifications.stream()
                .filter(n -> "LOW_STOCK".equals(n.getNotificationType()))
                .count());
        // NOTE: nothing in the current codebase creates an "EXPIRY" notification —
        // ExpiryServiceImpl never calls notificationService. This will read 0 until
        // a scheduled expiry-check job is added that creates notifications with
        // that type.
        data.put("expiryAlerts", notifications.stream()
                .filter(n -> "EXPIRY".equals(n.getNotificationType()))
                .count());
        data.put("unreadNotifications", notificationRepository.countByIsReadFalse());

        // ---------------- User analytics ----------------
        data.put("totalUsers", (long) users.size());
        data.put("totalAdmins", countByRole(users, "ADMIN"));
        data.put("totalPharmacists", countByRole(users, "PHARMACIST"));
        data.put("totalStaff", countByRole(users, "STAFF"));

        // ---------------- Charts ----------------
        data.put("categoryData", buildCategoryData(medicines));
        data.put("dosageFormData", buildDosageFormData(medicines));
        data.put("monthlyPurchases", buildMonthlyPurchases(orders));
        data.put("supplierContribution", buildSupplierContribution(suppliers, medicines));
        data.put("mostStocked", topStocked(medicines, true));
        data.put("leastStocked", topStocked(medicines, false));

        data.put("lowStockTrend", buildLowStockTrend());

        return data;
    }

    private long countByRole(List<User> users, String roleName) {
        return users.stream()
                .filter(u -> u.getRole() != null && roleName.equalsIgnoreCase(u.getRole().getRoleName()))
                .count();
    }

    private String mostActiveSupplier(List<Supplier> suppliers, List<PurchaseOrder> orders) {

        Map<Integer, Long> counts = orders.stream()
                .filter(o -> o.getSupplier() != null)
                .collect(Collectors.groupingBy(o -> o.getSupplier().getSupplierId(), Collectors.counting()));

        return counts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .flatMap(e -> suppliers.stream()
                        .filter(s -> s.getSupplierId().equals(e.getKey()))
                        .findFirst())
                .map(Supplier::getSupplierName)
                .orElse("—");
    }

    private List<Map<String, Object>> buildCategoryData(List<Medicine> medicines) {

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

    private List<Map<String, Object>> buildDosageFormData(List<Medicine> medicines) {

        Map<String, Long> agg = medicines.stream()
                .collect(Collectors.groupingBy(
                        m -> (m.getCategory() == null || m.getCategory().isBlank())
                                ? "Unspecified" : m.getCategory(),
                        LinkedHashMap::new,
                        Collectors.counting()));

        List<Map<String, Object>> result = new ArrayList<>();
        agg.forEach((form, count) -> result.add(mapOf("form", form, "count", count)));
        return result;
    }

    private List<Map<String, Object>> buildMonthlyPurchases(List<PurchaseOrder> orders) {

        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM");
        YearMonth start = YearMonth.now().minusMonths(5);

        Map<YearMonth, Long> counts = new LinkedHashMap<>();
        for (int i = 0; i < 6; i++) {
            counts.put(start.plusMonths(i), 0L);
        }

        for (PurchaseOrder o : orders) {
            if (o.getPurchaseDate() == null) continue;
            YearMonth ym = YearMonth.from(o.getPurchaseDate());
            if (counts.containsKey(ym)) {
                counts.merge(ym, 1L, Long::sum);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        counts.forEach((ym, count) -> result.add(mapOf("month", ym.atDay(1).format(monthFmt), "orders", count)));
        return result;
    }

    private List<Map<String, Object>> buildLowStockTrend() {

        YearMonth start = YearMonth.now().minusMonths(5);
        LocalDate from = start.atDay(1);
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM");

        Map<YearMonth, Integer> counts = new LinkedHashMap<>();
        for (int i = 0; i < 6; i++) {
            counts.put(start.plusMonths(i), 0);
        }

        // A snapshot is written daily. Keeping the latest one in each month
        // reflects that month's closing low-stock count.
        for (LowStockSnapshot snapshot : lowStockSnapshotRepository
                .findBySnapshotDateGreaterThanEqualOrderBySnapshotDateAsc(from)) {
            if (snapshot.getSnapshotDate() != null && snapshot.getLowStockCount() != null) {
                counts.put(YearMonth.from(snapshot.getSnapshotDate()), snapshot.getLowStockCount());
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        counts.forEach((month, count) -> result.add(mapOf(
                "month", month.atDay(1).format(monthFmt),
                "count", count)));
        return result;
    }

    private List<Map<String, Object>> buildSupplierContribution(List<Supplier> suppliers, List<Medicine> medicines) {

        List<Map<String, Object>> result = new ArrayList<>();

        for (Supplier s : suppliers) {
            long count = medicines.stream()
                    .filter(m -> m.getSupplier() != null && m.getSupplier().getSupplierId().equals(s.getSupplierId()))
                    .count();
            result.add(mapOf("supplier", s.getSupplierName(), "medicines", count));
        }

        result.sort((a, b) -> Long.compare((long) b.get("medicines"), (long) a.get("medicines")));
        return result;
    }

    private List<Map<String, Object>> topStocked(List<Medicine> medicines, boolean highest) {

        Comparator<Medicine> cmp = Comparator.comparingInt(m -> m.getQuantity() != null ? m.getQuantity() : 0);
        if (highest) cmp = cmp.reversed();

        return medicines.stream()
                .sorted(cmp)
                .limit(5)
                .map(m -> mapOf("medicine", m.getMedicineName(), "qty", m.getQuantity()))
                .collect(Collectors.toList());
    }

    private Map<String, Object> mapOf(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) {
            m.put((String) kv[i], kv[i + 1]);
        }
        return m;
    }
}
