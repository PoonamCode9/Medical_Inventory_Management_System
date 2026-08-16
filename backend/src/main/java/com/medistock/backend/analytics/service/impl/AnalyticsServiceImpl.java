package com.medistock.backend.analytics.service.impl;

import com.medistock.backend.analytics.dto.AnalyticsData;
import com.medistock.backend.analytics.dto.AnalyticsResponse;
import com.medistock.backend.analytics.service.AnalyticsService;
import com.medistock.backend.dto.response.MedicineResponse;
import com.medistock.backend.dto.response.SupplierResponse;
import com.medistock.backend.dto.response.StockLogResponse;
import com.medistock.backend.dto.response.NotificationResponse;
import com.medistock.backend.entity.*;
import com.medistock.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final StockLogRepository stockLogRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalyticsDashboard(
            LocalDate startDate,
            LocalDate endDate,
            Integer categoryId,
            Integer supplierId,
            String stockStatus,
            String expiryStatus
    ) {
        log.info("Generating Analytics Dashboard: startDate={}, endDate={}, categoryId={}, supplierId={}, stockStatus={}, expiryStatus={}",
                startDate, endDate, categoryId, supplierId, stockStatus, expiryStatus);

        LocalDate today = LocalDate.now();

        // 1. Fetch All Inventories with Details to avoid N+1
        List<Inventory> allInventory = inventoryRepository.findAllWithDetails();

        // 2. Filter Inventory / Medicines list
        List<Inventory> filteredInventory = allInventory.stream()
                .filter(item -> {
                    Medicine m = item.getMedicine();
                    if (m == null) return false;

                    // Category Filter
                    if (categoryId != null && (m.getCategory() == null || !m.getCategory().getCategoryId().equals(categoryId))) {
                        return false;
                    }

                    // Supplier Filter
                    if (supplierId != null && (m.getSupplier() == null || !m.getSupplier().getSupplierId().equals(supplierId))) {
                        return false;
                    }

                    // Stock Status Filter
                    if (stockStatus != null && !stockStatus.equalsIgnoreCase("ALL")) {
                        int minStock = item.getMinimumStock() != null ? item.getMinimumStock() : 10;
                        if (stockStatus.equalsIgnoreCase("LOW_STOCK")) {
                            if (item.getQuantity() <= 0 || item.getQuantity() > minStock) return false;
                        } else if (stockStatus.equalsIgnoreCase("OUT_OF_STOCK")) {
                            if (item.getQuantity() != 0) return false;
                        } else if (stockStatus.equalsIgnoreCase("NORMAL")) {
                            if (item.getQuantity() <= minStock) return false;
                        }
                    }

                    // Expiry Status Filter
                    if (expiryStatus != null && !expiryStatus.equalsIgnoreCase("ALL")) {
                        if (m.getExpiryDate() == null) return false;
                        long days = java.time.temporal.ChronoUnit.DAYS.between(today, m.getExpiryDate());
                        if (expiryStatus.equalsIgnoreCase("EXPIRED")) {
                            if (days >= 0) return false;
                        } else if (expiryStatus.equalsIgnoreCase("EXPIRING_SOON")) {
                            if (days < 0 || days > 60) return false;
                        } else if (expiryStatus.equalsIgnoreCase("VALID")) {
                            if (days <= 60) return false;
                        }
                    }

                    return true;
                })
                .collect(Collectors.toList());

        // 3. Basic Counters
        long totalMedicines = filteredInventory.size();
        
        long totalSuppliers = filteredInventory.stream()
                .map(i -> i.getMedicine().getSupplier())
                .filter(Objects::nonNull)
                .map(Supplier::getSupplierId)
                .distinct()
                .count();
        if (supplierId == null && categoryId == null && (stockStatus == null || stockStatus.equals("ALL")) && (expiryStatus == null || expiryStatus.equals("ALL"))) {
            totalSuppliers = supplierRepository.count();
        }

        long totalCategories = filteredInventory.stream()
                .map(i -> i.getMedicine().getCategory())
                .filter(Objects::nonNull)
                .map(Category::getCategoryId)
                .distinct()
                .count();
        if (categoryId == null && supplierId == null && (stockStatus == null || stockStatus.equals("ALL")) && (expiryStatus == null || expiryStatus.equals("ALL"))) {
            totalCategories = categoryRepository.count();
        }

        long totalInventoryQuantity = filteredInventory.stream()
                .mapToLong(Inventory::getQuantity)
                .sum();

        BigDecimal totalInventoryValue = BigDecimal.ZERO;
        for (Inventory item : filteredInventory) {
            Medicine m = item.getMedicine();
            BigDecimal price = m.getSellingPrice() != null ? m.getSellingPrice() : (m.getUnitPrice() != null ? m.getUnitPrice() : (m.getPurchasePrice() != null ? m.getPurchasePrice() : BigDecimal.ZERO));
            totalInventoryValue = totalInventoryValue.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        long lowStockMedicines = filteredInventory.stream()
                .filter(item -> {
                    int minStock = item.getMinimumStock() != null ? item.getMinimumStock() : 10;
                    return item.getQuantity() > 0 && item.getQuantity() <= minStock;
                })
                .count();

        long outOfStockMedicines = filteredInventory.stream()
                .filter(item -> item.getQuantity() == 0)
                .count();

        long expiringSoonMedicines = filteredInventory.stream()
                .filter(item -> {
                    LocalDate expiry = item.getMedicine().getExpiryDate();
                    if (expiry == null) return false;
                    long days = java.time.temporal.ChronoUnit.DAYS.between(today, expiry);
                    return days >= 0 && days <= 60;
                })
                .count();

        long expiredMedicines = filteredInventory.stream()
                .filter(item -> {
                    LocalDate expiry = item.getMedicine().getExpiryDate();
                    return expiry != null && expiry.isBefore(today);
                })
                .count();

        // 4. Extreme Stock Items
        MedicineResponse highestStockMedicine = null;
        Inventory highestInv = filteredInventory.stream()
                .max(Comparator.comparingInt(Inventory::getQuantity))
                .orElse(null);
        if (highestInv != null) {
            highestStockMedicine = mapToMedicineResponse(highestInv.getMedicine());
        }

        MedicineResponse lowestStockMedicine = null;
        Inventory lowestInv = filteredInventory.stream()
                .filter(i -> i.getQuantity() > 0)
                .min(Comparator.comparingInt(Inventory::getQuantity))
                .orElse(null);
        if (lowestInv != null) {
            lowestStockMedicine = mapToMedicineResponse(lowestInv.getMedicine());
        }

        double averageMedicinePrice = filteredInventory.stream()
                .map(i -> i.getMedicine().getSellingPrice())
                .filter(Objects::nonNull)
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(0.0);

        // 5. Purchase Order Analytics
        List<PurchaseOrder> allOrders = purchaseOrderRepository.findAll().stream()
                .filter(po -> {
                    if (supplierId != null && (po.getSupplier() == null || !po.getSupplier().getSupplierId().equals(supplierId))) {
                        return false;
                    }
                    if (startDate != null && po.getOrderDate() != null && po.getOrderDate().isBefore(startDate)) {
                        return false;
                    }
                    if (endDate != null && po.getOrderDate() != null && po.getOrderDate().isAfter(endDate)) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        long purchaseOrdersPending = allOrders.stream().filter(po -> "PENDING".equalsIgnoreCase(po.getStatus())).count();
        long purchaseOrdersApproved = allOrders.stream().filter(po -> "APPROVED".equalsIgnoreCase(po.getStatus()) || "ORDERED".equalsIgnoreCase(po.getStatus())).count();
        long purchaseOrdersDelivered = allOrders.stream().filter(po -> "DELIVERED".equalsIgnoreCase(po.getStatus()) || "RECEIVED".equalsIgnoreCase(po.getStatus())).count();
        long purchaseOrdersCancelled = allOrders.stream().filter(po -> "CANCELLED".equalsIgnoreCase(po.getStatus())).count();
        long totalPurchaseOrders = allOrders.size();
        BigDecimal totalPurchases = allOrders.stream()
                .map(PurchaseOrder::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 6. Supplier Analytics
        SupplierResponse supplierHighestMedicines = null;
        Map<Supplier, Long> suppMedsMap = filteredInventory.stream()
                .map(i -> i.getMedicine().getSupplier())
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
        Supplier bestSupp = suppMedsMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
        if (bestSupp != null) {
            supplierHighestMedicines = mapToSupplierResponse(bestSupp);
        }

        SupplierResponse supplierHighestPurchases = null;
        Map<Supplier, Long> suppPurchMap = allOrders.stream()
                .map(PurchaseOrder::getSupplier)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
        Supplier purchaseSupp = suppPurchMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
        if (purchaseSupp != null) {
            supplierHighestPurchases = mapToSupplierResponse(purchaseSupp);
        }

        // 7. Notification Analytics
        List<Notification> allNotifications = notificationRepository.findAll().stream()
                .filter(n -> {
                    if (startDate != null && n.getCreatedAt() != null && n.getCreatedAt().toLocalDate().isBefore(startDate)) {
                        return false;
                    }
                    if (endDate != null && n.getCreatedAt() != null && n.getCreatedAt().toLocalDate().isAfter(endDate)) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        long unreadNotifications = allNotifications.stream().filter(n -> n.getIsRead() != null && !n.getIsRead()).count();
        long totalNotifications = allNotifications.size();
        long notificationsToday = allNotifications.stream()
                .filter(n -> n.getCreatedAt() != null && n.getCreatedAt().toLocalDate().equals(today))
                .count();
        long notificationsThisWeek = allNotifications.stream()
                .filter(n -> n.getCreatedAt() != null && n.getCreatedAt().toLocalDate().isAfter(today.minusDays(7)))
                .count();

        // 8. Stock Movement & Growth Analytics
        LocalDate growthStartDate = startDate != null ? startDate : today.minusDays(30);
        LocalDateTime growthStartDateTime = growthStartDate.atStartOfDay();

        List<StockLog> logsSinceStart = stockLogRepository.findAll().stream()
                .filter(log -> log.getUpdatedAt() != null && log.getUpdatedAt().isAfter(growthStartDateTime))
                .filter(logEntry -> {
                    Medicine m = logEntry.getMedicine();
                    if (m == null) return false;
                    if (categoryId != null && (m.getCategory() == null || !m.getCategory().getCategoryId().equals(categoryId))) {
                        return false;
                    }
                    if (supplierId != null && (m.getSupplier() == null || !m.getSupplier().getSupplierId().equals(supplierId))) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        long todayStockIn = 0;
        long todayStockOut = 0;
        long weeklyStockMovement = 0;
        long monthlyStockMovement = 0;

        long netStockInSincePeriodStart = 0;
        long netStockOutSincePeriodStart = 0;

        for (StockLog logEntry : logsSinceStart) {
            LocalDate logDate = logEntry.getUpdatedAt().toLocalDate();
            int oldQ = logEntry.getOldQuantity() != null ? logEntry.getOldQuantity() : 0;
            int newQ = logEntry.getNewQuantity() != null ? logEntry.getNewQuantity() : 0;

            long diff = 0;
            boolean isIn = false;
            boolean isOut = false;

            if ("STOCK_IN".equalsIgnoreCase(logEntry.getAction())) {
                diff = newQ - oldQ;
                isIn = true;
            } else if ("STOCK_OUT".equalsIgnoreCase(logEntry.getAction())) {
                diff = oldQ - newQ;
                isOut = true;
            } else if ("ADJUST".equalsIgnoreCase(logEntry.getAction())) {
                if (newQ > oldQ) {
                    diff = newQ - oldQ;
                    isIn = true;
                } else {
                    diff = oldQ - newQ;
                    isOut = true;
                }
            }

            if (diff < 0) diff = 0;

            // Grow start accumulator
            if (isIn) {
                netStockInSincePeriodStart += diff;
            } else if (isOut) {
                netStockOutSincePeriodStart += diff;
            }

            // Today
            if (logDate.equals(today)) {
                if (isIn) todayStockIn += diff;
                if (isOut) todayStockOut += diff;
            }

            // Weekly (7 days)
            if (logDate.isAfter(today.minusDays(7))) {
                weeklyStockMovement += diff;
            }

            // Monthly (30 days)
            if (logDate.isAfter(today.minusDays(30))) {
                monthlyStockMovement += diff;
            }
        }

        long startingTotalQty = totalInventoryQuantity - netStockInSincePeriodStart + netStockOutSincePeriodStart;
        double inventoryGrowthPercentage = 0.0;
        if (startingTotalQty > 0) {
            inventoryGrowthPercentage = ((double) (totalInventoryQuantity - startingTotalQty) / startingTotalQty) * 100.0;
        } else if (totalInventoryQuantity > 0) {
            inventoryGrowthPercentage = 100.0;
        }

        // 9. Recent lists
        List<StockLogResponse> recentTransactions = logsSinceStart.stream()
                .sorted(Comparator.comparing(StockLog::getUpdatedAt).reversed())
                .limit(10)
                .map(this::mapToStockLogResponse)
                .collect(Collectors.toList());

        List<NotificationResponse> recentNotifs = allNotifications.stream()
                .sorted(Comparator.comparing(Notification::getCreatedAt).reversed())
                .limit(10)
                .map(this::mapToNotificationResponse)
                .collect(Collectors.toList());

        // 10. Chart Calculations
        // Chart 1: Inventory by Category
        Map<String, Long> categoryQtyMap = filteredInventory.stream()
                .collect(Collectors.groupingBy(
                        i -> i.getMedicine().getCategory() != null ? i.getMedicine().getCategory().getCategoryName() : "General",
                        Collectors.summingLong(Inventory::getQuantity)
                ));
        List<AnalyticsData.CategoryMetric> inventoryByCategory = categoryQtyMap.entrySet().stream()
                .map(entry -> {
                    long count = filteredInventory.stream()
                            .filter(i -> {
                                String name = i.getMedicine().getCategory() != null ? i.getMedicine().getCategory().getCategoryName() : "General";
                                return name.equals(entry.getKey());
                            })
                            .count();
                    return new AnalyticsData.CategoryMetric(entry.getKey(), count, entry.getValue());
                })
                .collect(Collectors.toList());

        // Chart 2: Purchase Orders by Status
        List<AnalyticsData.StatusMetric> purchaseOrdersByStatus = List.of(
                new AnalyticsData.StatusMetric("Pending", purchaseOrdersPending),
                new AnalyticsData.StatusMetric("Approved", purchaseOrdersApproved),
                new AnalyticsData.StatusMetric("Delivered", purchaseOrdersDelivered),
                new AnalyticsData.StatusMetric("Cancelled", purchaseOrdersCancelled)
        );

        // Chart 3: Monthly Stock Movement (Last 6 Months)
        List<AnalyticsData.MonthlyMovementMetric> monthlyStockMovementChart = new ArrayList<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = today.minusMonths(i);
            String monthName = monthDate.format(monthFormatter);

            long inQty = 0;
            long outQty = 0;
            for (StockLog logEntry : logsSinceStart) {
                if (logEntry.getUpdatedAt().getMonth() == monthDate.getMonth() && logEntry.getUpdatedAt().getYear() == monthDate.getYear()) {
                    int oldQ = logEntry.getOldQuantity() != null ? logEntry.getOldQuantity() : 0;
                    int newQ = logEntry.getNewQuantity() != null ? logEntry.getNewQuantity() : 0;
                    if ("STOCK_IN".equalsIgnoreCase(logEntry.getAction())) {
                        inQty += (newQ - oldQ);
                    } else if ("STOCK_OUT".equalsIgnoreCase(logEntry.getAction())) {
                        outQty += (oldQ - newQ);
                    } else if ("ADJUST".equalsIgnoreCase(logEntry.getAction())) {
                        if (newQ > oldQ) {
                            inQty += (newQ - oldQ);
                        } else {
                            outQty += (oldQ - newQ);
                        }
                    }
                }
            }
            monthlyStockMovementChart.add(new AnalyticsData.MonthlyMovementMetric(monthName, inQty, outQty));
        }

        // Chart 4: Expiry Status
        List<AnalyticsData.ExpiryStatusMetric> expiryStatusChart = List.of(
                new AnalyticsData.ExpiryStatusMetric("Expired", expiredMedicines),
                new AnalyticsData.ExpiryStatusMetric("Expiring Soon", expiringSoonMedicines),
                new AnalyticsData.ExpiryStatusMetric("Safe", totalMedicines - expiredMedicines - expiringSoonMedicines)
        );

        // Chart 5: Supplier Contribution
        Map<String, Long> supplierContrMap = filteredInventory.stream()
                .map(i -> i.getMedicine().getSupplier())
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(Supplier::getSupplierName, Collectors.counting()));
        List<AnalyticsData.SupplierContributionMetric> supplierContribution = supplierContrMap.entrySet().stream()
                .map(entry -> new AnalyticsData.SupplierContributionMetric(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(10)
                .collect(Collectors.toList());

        // Chart 6: Weekly Inventory Trend (Last 7 Days)
        List<AnalyticsData.WeeklyTrendMetric> weeklyInventoryTrend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime endOfDay = date.atTime(23, 59, 59);

            long netIn = 0;
            long netOut = 0;
            for (StockLog logEntry : logsSinceStart) {
                if (logEntry.getUpdatedAt().isAfter(endOfDay)) {
                    int oldQ = logEntry.getOldQuantity() != null ? logEntry.getOldQuantity() : 0;
                    int newQ = logEntry.getNewQuantity() != null ? logEntry.getNewQuantity() : 0;
                    if ("STOCK_IN".equalsIgnoreCase(logEntry.getAction())) {
                        netIn += (newQ - oldQ);
                    } else if ("STOCK_OUT".equalsIgnoreCase(logEntry.getAction())) {
                        netOut += (oldQ - newQ);
                    } else if ("ADJUST".equalsIgnoreCase(logEntry.getAction())) {
                        if (newQ > oldQ) {
                            netIn += (newQ - oldQ);
                        } else {
                            netOut += (oldQ - newQ);
                        }
                    }
                }
            }
            long dailyQty = totalInventoryQuantity - netIn + netOut;
            if (dailyQty < 0) dailyQty = 0;
            weeklyInventoryTrend.add(new AnalyticsData.WeeklyTrendMetric(date.toString(), dailyQty));
        }

        AnalyticsData data = AnalyticsData.builder()
                .totalMedicines(totalMedicines)
                .totalSuppliers(totalSuppliers)
                .totalCategories(totalCategories)
                .totalUsers(userRepository.count())
                .totalInventoryQuantity(totalInventoryQuantity)
                .totalInventoryValue(totalInventoryValue)
                .lowStockMedicines(lowStockMedicines)
                .outOfStockMedicines(outOfStockMedicines)
                .expiringSoonMedicines(expiringSoonMedicines)
                .expiredMedicines(expiredMedicines)
                .purchaseOrdersPending(purchaseOrdersPending)
                .purchaseOrdersApproved(purchaseOrdersApproved)
                .purchaseOrdersDelivered(purchaseOrdersDelivered)
                .purchaseOrdersCancelled(purchaseOrdersCancelled)
                .totalPurchaseOrders(totalPurchaseOrders)
                .totalPurchases(totalPurchases)
                .inventoryGrowthPercentage(inventoryGrowthPercentage)
                .averageMedicinePrice(averageMedicinePrice)
                .highestStockMedicine(highestStockMedicine)
                .lowestStockMedicine(lowestStockMedicine)
                .supplierHighestMedicines(supplierHighestMedicines)
                .supplierHighestPurchases(supplierHighestPurchases)
                .unreadNotifications(unreadNotifications)
                .totalNotifications(totalNotifications)
                .notificationsToday(notificationsToday)
                .notificationsThisWeek(notificationsThisWeek)
                .todayStockIn(todayStockIn)
                .todayStockOut(todayStockOut)
                .weeklyStockMovement(weeklyStockMovement)
                .monthlyStockMovement(monthlyStockMovement)
                .recentStockTransactions(recentTransactions)
                .recentNotifications(recentNotifs)
                .inventoryByCategory(inventoryByCategory)
                .purchaseOrdersByStatus(purchaseOrdersByStatus)
                .monthlyStockMovementChart(monthlyStockMovementChart)
                .expiryStatus(expiryStatusChart)
                .supplierContribution(supplierContribution)
                .weeklyInventoryTrend(weeklyInventoryTrend)
                .build();

        return AnalyticsResponse.builder()
                .success(true)
                .timestamp(LocalDateTime.now().toString())
                .analytics(data)
                .build();
    }

    private MedicineResponse mapToMedicineResponse(Medicine medicine) {
        if (medicine == null) return null;

        String catName = medicine.getCategory() != null ? medicine.getCategory().getCategoryName() : "General";
        Integer catId = medicine.getCategory() != null ? medicine.getCategory().getCategoryId() : null;
        String suppName = medicine.getSupplier() != null ? medicine.getSupplier().getSupplierName() : "Default Supplier";
        Integer suppId = medicine.getSupplier() != null ? medicine.getSupplier().getSupplierId() : null;
        String suppEmail = medicine.getSupplier() != null ? medicine.getSupplier().getEmail() : "";
        String suppPhone = medicine.getSupplier() != null ? medicine.getSupplier().getPhone() : "";

        int qty = medicine.getInventory() != null ? medicine.getInventory().getQuantity() : 0;
        int minStock = medicine.getInventory() != null ? (medicine.getInventory().getMinimumStock() != null ? medicine.getInventory().getMinimumStock() : 10) : 10;

        long days = -1;
        String expiryStatus = "UNKNOWN";
        if (medicine.getExpiryDate() != null) {
            days = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), medicine.getExpiryDate());
            if (days < 0) {
                expiryStatus = "EXPIRED";
            } else if (days <= 60) {
                expiryStatus = "EXPIRING_SOON";
            } else {
                expiryStatus = "VALID";
            }
        }

        return MedicineResponse.builder()
                .medicineId(medicine.getMedicineId())
                .medicineName(medicine.getMedicineName())
                .genericName(medicine.getGenericName())
                .categoryId(catId)
                .categoryName(catName)
                .supplierId(suppId)
                .supplierName(suppName)
                .supplierEmail(suppEmail)
                .supplierPhone(suppPhone)
                .batchNumber(medicine.getBatchNumber())
                .manufacturer(medicine.getManufacturer())
                .manufactureDate(medicine.getManufactureDate())
                .expiryDate(medicine.getExpiryDate())
                .purchasePrice(medicine.getPurchasePrice())
                .sellingPrice(medicine.getSellingPrice())
                .gst(medicine.getGst())
                .quantity(qty)
                .minimumStock(minStock)
                .barcode(medicine.getBarcode())
                .imageUrl(medicine.getImageUrl())
                .description(medicine.getDescription())
                .dosage(medicine.getDosage())
                .unit(medicine.getUnit())
                .daysUntilExpiry(days >= 0 ? days : null)
                .expiryStatus(expiryStatus)
                .isLowStock(qty <= minStock)
                .build();
    }

    private SupplierResponse mapToSupplierResponse(Supplier supplier) {
        if (supplier == null) return null;
        return SupplierResponse.builder()
                .supplierId(supplier.getSupplierId())
                .supplierName(supplier.getSupplierName())
                .contactPerson(supplier.getContactPerson())
                .phone(supplier.getPhone())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .status(supplier.getStatus())
                .build();
    }

    private StockLogResponse mapToStockLogResponse(StockLog logEntry) {
        if (logEntry == null) return null;

        StockLogResponse.MedicineDto medicineDto = null;
        if (logEntry.getMedicine() != null) {
            medicineDto = StockLogResponse.MedicineDto.builder()
                    .medicineId(logEntry.getMedicine().getMedicineId())
                    .medicineName(logEntry.getMedicine().getMedicineName())
                    .batchNumber(logEntry.getMedicine().getBatchNumber())
                    .build();
        }

        StockLogResponse.UserDto userDto = null;
        if (logEntry.getUser() != null) {
            userDto = StockLogResponse.UserDto.builder()
                    .userId(logEntry.getUser().getUserId())
                    .email(logEntry.getUser().getEmail())
                    .build();
        }

        return StockLogResponse.builder()
                .stockLogId(logEntry.getStockLogId())
                .action(logEntry.getAction())
                .oldQuantity(logEntry.getOldQuantity())
                .newQuantity(logEntry.getNewQuantity())
                .reason(logEntry.getReason())
                .updatedAt(logEntry.getUpdatedAt())
                .medicine(medicineDto)
                .user(userDto)
                .build();
    }

    private NotificationResponse mapToNotificationResponse(Notification n) {
        if (n == null) return null;
        return NotificationResponse.builder()
                .notificationId(n.getNotificationId())
                .userId(n.getUser() != null ? n.getUser().getUserId() : null)
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null)
                .build();
    }
}
