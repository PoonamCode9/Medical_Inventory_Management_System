package com.medistock.backend.service;

import com.medistock.backend.model.*;
import com.medistock.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public List<Map<String, Object>> generateReport(String type, LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        List<Map<String, Object>> reportData = new ArrayList<>();

        switch (type.toLowerCase()) {
            case "sales":
                List<Sale> sales = saleRepository.findBySaleDateBetween(start, end);
                for (Sale s : sales) {
                    for (SaleItem item : s.getItems()) {
                        Map<String, Object> row = new LinkedHashMap<>();
                        row.put("Date", s.getSaleDate().toLocalDate().toString());
                        row.put("Invoice ID", s.getId().toString());
                        row.put("Customer Name", s.getCustomerName() != null ? s.getCustomerName() : "Walk-in");
                        row.put("Customer Phone", s.getCustomerPhone() != null ? s.getCustomerPhone() : "N/A");
                        row.put("Medicine Name", item.getMedicine().getName());
                        row.put("Batch Number", item.getBatchNumber());
                        row.put("Quantity", item.getQuantity());
                        row.put("Unit Price", "₹" + item.getUnitPrice());
                        BigDecimal total = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                        row.put("Total Paid", "₹" + total);
                        row.put("GST (12% incl.)", "₹" + item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())).multiply(BigDecimal.valueOf(0.12)).divide(BigDecimal.valueOf(1.12), 2, BigDecimal.ROUND_HALF_UP));
                        row.put("Payment Mode", s.getPaymentMode());
                        reportData.add(row);
                    }
                }
                break;

            case "purchase":
                List<Purchase> purchases = purchaseRepository.findByPurchaseDateBetween(start, end);
                for (Purchase p : purchases) {
                    for (PurchaseItem item : p.getItems()) {
                        Map<String, Object> row = new LinkedHashMap<>();
                        row.put("Date", p.getPurchaseDate().toLocalDate().toString());
                        row.put("Order ID", p.getId().toString());
                        row.put("Supplier Name", p.getSupplier().getName());
                        row.put("Medicine Name", item.getMedicine().getName());
                        row.put("Batch Number", item.getBatchNumber());
                        row.put("Quantity", item.getQuantity());
                        row.put("Unit Cost", "₹" + item.getUnitCostPrice());
                        BigDecimal total = item.getUnitCostPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                        row.put("Total Cost", "₹" + total);
                        row.put("GST Added (12%)", "₹" + total.multiply(BigDecimal.valueOf(0.12)).setScale(2, BigDecimal.ROUND_HALF_UP));
                        row.put("Status", p.getStatus());
                        reportData.add(row);
                    }
                }
                break;

            case "inventory":
                List<Medicine> medicines = medicineRepository.findAll();
                for (Medicine m : medicines) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("Medicine ID", m.getId().toString());
                    row.put("Name", m.getName());
                    row.put("Generic Name", m.getGenericName());
                    row.put("Category", m.getCategory() != null ? m.getCategory().getName() : "N/A");
                    row.put("Supplier", m.getSupplier() != null ? m.getSupplier().getName() : "N/A");
                    row.put("Cost Price", "₹" + m.getCostPrice());
                    row.put("Selling Price", "₹" + m.getSellingPrice());
                    row.put("Stock Quantity", m.getStockQuantity());
                    row.put("Inventory Value", "₹" + m.getCostPrice().multiply(BigDecimal.valueOf(m.getStockQuantity())));
                    reportData.add(row);
                }
                break;

            case "lowstock":
                List<Medicine> lowStock = medicineRepository.findLowStockMedicines();
                for (Medicine m : lowStock) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("Medicine ID", m.getId().toString());
                    row.put("Name", m.getName());
                    row.put("Category", m.getCategory() != null ? m.getCategory().getName() : "N/A");
                    row.put("Supplier", m.getSupplier() != null ? m.getSupplier().getName() : "N/A");
                    row.put("Min Alert Limit", m.getMinStockAlert());
                    row.put("Current Stock", m.getStockQuantity());
                    row.put("Status", "RE-ORDER REQUIRED");
                    reportData.add(row);
                }
                break;

            case "expiry":
                List<Inventory> batches = inventoryRepository.findExpiringSoon(LocalDate.now().plusDays(180)); // Expiring in next 6 months
                for (Inventory i : batches) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("Medicine Name", i.getMedicine().getName());
                    row.put("Batch Number", i.getBatchNumber());
                    row.put("Quantity", i.getQuantity());
                    row.put("Expiry Date", i.getExpiryDate().toString());
                    row.put("Location", i.getLocation() != null ? i.getLocation() : "General");
                    long days = ChronoUnit.DAYS.between(LocalDate.now(), i.getExpiryDate());
                    row.put("Days Until Expiry", days > 0 ? days + " Days" : "EXPIRED");
                    reportData.add(row);
                }
                break;

            case "gst":
                // Collect Sales GST
                List<Sale> gsSales = saleRepository.findBySaleDateBetween(start, end);
                for (Sale s : gsSales) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("Date", s.getSaleDate().toLocalDate().toString());
                    row.put("Reference ID", "SALE-" + s.getId());
                    row.put("Party", s.getCustomerName() != null ? s.getCustomerName() : "Walk-in");
                    row.put("Transaction Type", "SALE");
                    row.put("Total Amount", "₹" + s.getTotalAmount());
                    row.put("GST Rate", "12%");
                    row.put("GST Collected", "₹" + s.getGstAmount());
                    row.put("GST Paid", "₹0.00");
                    reportData.add(row);
                }
                // Collect Purchase GST
                List<Purchase> gsPurchases = purchaseRepository.findByPurchaseDateBetween(start, end);
                for (Purchase p : gsPurchases) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("Date", p.getPurchaseDate().toLocalDate().toString());
                    row.put("Reference ID", "PURCH-" + p.getId());
                    row.put("Party", p.getSupplier().getName());
                    row.put("Transaction Type", "PURCHASE");
                    row.put("Total Amount", "₹" + p.getTotalAmount());
                    row.put("GST Rate", "12%");
                    row.put("GST Collected", "₹0.00");
                    row.put("GST Paid", "₹" + p.getGstAmount());
                    reportData.add(row);
                }
                break;

            case "profitloss":
                List<Sale> plSales = saleRepository.findBySaleDateBetween(start, end);
                BigDecimal totalSales = plSales.stream()
                        .map(Sale::getTotalAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                List<Purchase> plPurchases = purchaseRepository.findByPurchaseDateBetween(start, end);
                BigDecimal totalPurchases = plPurchases.stream()
                        .map(Purchase::getTotalAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal salesGst = plSales.stream()
                        .map(Sale::getGstAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal purchaseGst = plPurchases.stream()
                        .map(Purchase::getGstAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                Map<String, Object> row1 = new LinkedHashMap<>();
                row1.put("Metric", "Total Sales Revenue (Gross)");
                row1.put("Value", "₹" + totalSales);
                reportData.add(row1);

                Map<String, Object> row2 = new LinkedHashMap<>();
                row2.put("Metric", "Total Purchases Cost (Gross)");
                row2.put("Value", "-₹" + totalPurchases);
                reportData.add(row2);

                Map<String, Object> row3 = new LinkedHashMap<>();
                row3.put("Metric", "GST Collected on Sales");
                row3.put("Value", "₹" + salesGst);
                reportData.add(row3);

                Map<String, Object> row4 = new LinkedHashMap<>();
                row4.put("Metric", "GST Paid on Purchases");
                row4.put("Value", "₹" + purchaseGst);
                reportData.add(row4);

                Map<String, Object> row5 = new LinkedHashMap<>();
                row5.put("Metric", "Net GST Liability (Collected - Paid)");
                row5.put("Value", "₹" + salesGst.subtract(purchaseGst));
                reportData.add(row5);

                Map<String, Object> row6 = new LinkedHashMap<>();
                row6.put("Metric", "Net Net Profit (Sales - Purchases)");
                row6.put("Value", "₹" + totalSales.subtract(totalPurchases));
                reportData.add(row6);
                break;
        }

        return reportData;
    }
}
