package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.model.Inventory;
import com.example.medistock.medistock.model.Sale;
import com.example.medistock.medistock.model.SaleItem;
import com.example.medistock.medistock.model.StockLog;
import com.example.medistock.medistock.repository.InventoryRepository;
import com.example.medistock.medistock.repository.MedicineRepository;
import com.example.medistock.medistock.repository.SaleRepository;
import com.example.medistock.medistock.repository.StockLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class SaleController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private StockLogRepository stockLogRepository;

    @GetMapping
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSaleById(@PathVariable Long id) {
        return saleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> processSale(@RequestBody Map<String, Object> payload) {
        try {
            Sale sale = new Sale();

            // 1. Header Information
            String billNum = (String) payload.getOrDefault("billNumber", payload.getOrDefault("bill_number", payload.get("billNo")));
            if (billNum == null || billNum.isBlank()) {
                billNum = "INV-" + System.currentTimeMillis() % 1000000;
            }
            sale.setBillNumber(billNum);

            String cust = (String) payload.getOrDefault("customerName", payload.getOrDefault("customer_name", payload.get("customer")));
            sale.setCustomerName(cust != null && !cust.isBlank() ? cust : "Walk-in Customer");

            String pm = (String) payload.getOrDefault("paymentMethod", payload.getOrDefault("payment_method", "CASH"));
            sale.setPaymentMethod(pm != null ? pm.toUpperCase() : "CASH");

            Object subtotalObj = payload.get("subtotal");
            double subtotal = subtotalObj != null ? Double.parseDouble(subtotalObj.toString()) : 0.0;
            sale.setSubtotal(subtotal);

            Object gstObj = payload.getOrDefault("gstAmount", payload.get("gst_amount"));
            double gst = gstObj != null ? Double.parseDouble(gstObj.toString()) : subtotal * 0.05;
            sale.setGstAmount(gst);

            Object grandTotalObj = payload.getOrDefault("grandTotal", payload.get("grand_total"));
            double grandTotal = grandTotalObj != null ? Double.parseDouble(grandTotalObj.toString()) : subtotal + gst;
            sale.setGrandTotal(grandTotal);

            sale.setSaleDate(LocalDate.now());
            sale.setCreatedAt(LocalDateTime.now());

            // 2. Parse Items
            List<SaleItem> saleItems = new ArrayList<>();
            Object itemsObj = payload.get("items");

            if (itemsObj instanceof List) {
                List<?> rawList = (List<?>) itemsObj;
                for (Object it : rawList) {
                    if (it instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> itemMap = (Map<String, Object>) it;
                        SaleItem item = new SaleItem();

                        Object mId = itemMap.get("medicineId");
                        if (mId == null) mId = itemMap.get("medicine_id");
                        if (mId == null) mId = itemMap.get("id");
                        if (mId != null && !mId.toString().isBlank()) {
                            item.setMedicineId(Long.parseLong(mId.toString()));
                        }

                        Object medNameObj = itemMap.get("medicineName");
                        if (medNameObj == null) medNameObj = itemMap.get("medicine_name");
                        if (medNameObj == null) medNameObj = itemMap.get("name");
                        item.setMedicineName(medNameObj != null ? medNameObj.toString() : "Medicine");

                        Object qObj = itemMap.get("quantity");
                        int qty = qObj != null ? Integer.parseInt(qObj.toString()) : 1;
                        item.setQuantity(qty);

                        Object upObj = itemMap.get("unitPrice");
                        if (upObj == null) upObj = itemMap.get("unit_price");
                        if (upObj == null) upObj = itemMap.get("price");
                        double up = upObj != null ? Double.parseDouble(upObj.toString()) : 0.0;
                        item.setUnitPrice(up);

                        Object tpObj = itemMap.get("totalPrice");
                        if (tpObj == null) tpObj = itemMap.get("total_price");
                        double tp = tpObj != null ? Double.parseDouble(tpObj.toString()) : (qty * up);
                        item.setTotalPrice(tp);

                        saleItems.add(item);

                        // 3. Deduct inventory batches & log stock outflow
                        if (item.getMedicineId() != null) {
                            List<Inventory> batches = inventoryRepository.findAll().stream()
                                    .filter(inv -> inv.getMedicine() != null &&
                                            inv.getMedicine().getId().equals(item.getMedicineId()) &&
                                            inv.getQuantity() != null && inv.getQuantity() > 0)
                                    .toList();

                            int remainingToDeduct = qty;
                            for (Inventory batch : batches) {
                                if (remainingToDeduct <= 0) break;
                                int available = batch.getQuantity() != null ? batch.getQuantity() : 0;
                                int deduction = Math.min(available, remainingToDeduct);

                                batch.setQuantity(available - deduction);
                                if (batch.getQuantity() == 0) {
                                    batch.setStockStatus("OUT_OF_STOCK");
                                } else if (batch.getQuantity() <= 20) {
                                    batch.setStockStatus("LOW_STOCK");
                                }
                                inventoryRepository.save(batch);
                                remainingToDeduct -= deduction;

                                // Stock log
                                StockLog log = new StockLog();
                                log.setInventoryId(batch.getId());
                                log.setMovementType("SOLD");
                                log.setQuantityChanged(deduction);
                                log.setLogDate(LocalDate.now());
                                stockLogRepository.save(log);
                            }
                        }
                    }
                }
            }

            sale.setItems(saleItems);
            Sale savedSale = saleRepository.save(sale);
            return ResponseEntity.ok(savedSale);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to process sale: " + e.getMessage());
        }
    }
}