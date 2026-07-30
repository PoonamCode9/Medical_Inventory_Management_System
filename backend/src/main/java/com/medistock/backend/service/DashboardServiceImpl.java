package com.medistock.backend.service;

import com.medistock.backend.dto.DashboardDTO;
import com.medistock.backend.model.*;
import com.medistock.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public DashboardDTO getDashboardData() {
        DashboardDTO dto = new DashboardDTO();

        // 1. Basic Counts
        dto.setTotalMedicines(medicineRepository.count());
        dto.setTotalUsers(userRepository.count());
        dto.setTotalCategories(categoryRepository.count());
        dto.setTotalSuppliers(supplierRepository.count());

        // 2. Inventory Value (₹)
        BigDecimal val = medicineRepository.findAll().stream()
                .map(m -> m.getCostPrice().multiply(BigDecimal.valueOf(m.getStockQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setInventoryValue(val);

        // 3. Date ranges
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = LocalDate.now().atTime(LocalTime.MAX);

        // 4. Sales metrics
        List<Sale> todaySales = saleRepository.findBySaleDateBetween(todayStart, todayEnd);
        BigDecimal todayRev = todaySales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTodayRevenue(todayRev);
        dto.setTodaySales(todayRev);

        List<Sale> monthSales = saleRepository.findBySaleDateBetween(monthStart, monthEnd);
        BigDecimal monthRev = monthSales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setMonthlyRevenue(monthRev);

        // 5. Purchase metrics
        List<Purchase> monthPurchases = purchaseRepository.findByPurchaseDateBetween(monthStart, monthEnd);
        BigDecimal monthExp = monthPurchases.stream()
                .map(Purchase::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setMonthlyExpenses(monthExp);

        // 6. Net Profit (₹)
        dto.setNetProfit(monthRev.subtract(monthExp));

        // 7. Alerts count
        dto.setLowStockCount(medicineRepository.findLowStockMedicines().size());
        dto.setExpiringCount(inventoryRepository.findExpiringSoon(LocalDate.now().plusDays(90)).size());

        // 8. Recent Activities
        List<String> activities = auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .limit(10)
                .map(log -> "[" + log.getTimestamp().toLocalDate() + " " + log.getTimestamp().toLocalTime().toString().substring(0, 5) + "] " + log.getUsername() + ": " + log.getAction() + " - " + log.getDetails())
                .collect(Collectors.toList());
        dto.setRecentActivities(activities);

        // 9. Pharmacist Specific Info
        long totalIssued = todaySales.stream()
                .flatMap(s -> s.getItems().stream())
                .mapToLong(SaleItem::getQuantity)
                .sum();
        dto.setMedicinesIssued(totalIssued);
        dto.setPendingOrders(purchaseRepository.findAll().stream().filter(p -> "ORDERED".equals(p.getStatus())).count());

        return dto;
    }
}
