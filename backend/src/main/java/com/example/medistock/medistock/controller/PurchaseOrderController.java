package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.model.Inventory;
import com.example.medistock.medistock.model.Medicine;
import com.example.medistock.medistock.model.PurchaseOrder;
import com.example.medistock.medistock.model.StockLog;
import com.example.medistock.medistock.repository.InventoryRepository;
import com.example.medistock.medistock.repository.MedicineRepository;
import com.example.medistock.medistock.repository.PurchaseOrderRepository;
import com.example.medistock.medistock.repository.StockLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private StockLogRepository stockLogRepository;

    @GetMapping
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return purchaseOrderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            PurchaseOrder order = new PurchaseOrder();

            String poNum = (String) payload.getOrDefault("poNumber", payload.get("po_number"));
            if (poNum == null || poNum.isBlank()) {
                poNum = "PO-" + LocalDate.now().getYear() + "-" + String.format("%04d", (purchaseOrderRepository.count() + 1));
            }
            order.setPoNumber(poNum);

            Object supIdObj = payload.getOrDefault("supplierId", payload.get("supplier_id"));
            if (supIdObj != null && !supIdObj.toString().isBlank()) {
                order.setSupplierId(Long.parseLong(supIdObj.toString()));
            }

            Object countObj = payload.getOrDefault("itemCount", payload.get("item_count"));
            if (countObj != null) {
                order.setItemCount(Integer.parseInt(countObj.toString()));
            } else {
                order.setItemCount(50);
            }

            Object totalObj = payload.getOrDefault("totalAmount", payload.getOrDefault("total_amount", payload.get("total")));
            if (totalObj != null) {
                order.setTotalAmount(Double.parseDouble(totalObj.toString()));
            } else {
                order.setTotalAmount(order.getItemCount() * 50.0);
            }

            Object dateObj = payload.getOrDefault("orderDate", payload.get("order_date"));
            if (dateObj != null && !dateObj.toString().isBlank()) {
                order.setOrderDate(LocalDate.parse(dateObj.toString()));
            } else {
                order.setOrderDate(LocalDate.now());
            }

            String status = (String) payload.getOrDefault("status", "PENDING");
            order.setStatus(status.toUpperCase());

            PurchaseOrder saved = purchaseOrderRepository.save(order);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to create purchase order: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return purchaseOrderRepository.findById(id).map(order -> {
            if (payload.containsKey("poNumber") || payload.containsKey("po_number")) {
                order.setPoNumber((String) payload.getOrDefault("poNumber", payload.get("po_number")));
            }
            if (payload.containsKey("supplierId") || payload.containsKey("supplier_id")) {
                Object supId = payload.getOrDefault("supplierId", payload.get("supplier_id"));
                if (supId != null) order.setSupplierId(Long.parseLong(supId.toString()));
            }
            if (payload.containsKey("itemCount") || payload.containsKey("item_count")) {
                Object c = payload.getOrDefault("itemCount", payload.get("item_count"));
                if (c != null) order.setItemCount(Integer.parseInt(c.toString()));
            }
            if (payload.containsKey("totalAmount") || payload.containsKey("total_amount") || payload.containsKey("total")) {
                Object t = payload.getOrDefault("totalAmount", payload.getOrDefault("total_amount", payload.get("total")));
                if (t != null) order.setTotalAmount(Double.parseDouble(t.toString()));
            }
            if (payload.containsKey("status")) {
                String st = (String) payload.get("status");
                order.setStatus(st.toUpperCase());
            }

            PurchaseOrder saved = purchaseOrderRepository.save(order);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @Transactional
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) Map<String, Object> body) {

        String newStatus = status;
        if (newStatus == null && body != null && body.containsKey("status")) {
            newStatus = (String) body.get("status");
        }

        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body("Status parameter is required");
        }

        final String normalizedStatus = newStatus.toUpperCase();

        Optional<PurchaseOrder> orderOpt = purchaseOrderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PurchaseOrder order = orderOpt.get();
        String previousStatus = order.getStatus();
        order.setStatus(normalizedStatus);
        PurchaseOrder saved = purchaseOrderRepository.save(order);

        // When transition to FULFILLED happens: automatically generate stock in inventory & stock_logs
        if ("FULFILLED".equals(normalizedStatus) && !"FULFILLED".equals(previousStatus)) {
            Medicine targetMed = null;
            if (order.getSupplierId() != null) {
                targetMed = medicineRepository.findAll().stream()
                        .filter(m -> m.getSupplier() != null && m.getSupplier().getId().equals(order.getSupplierId()))
                        .findFirst()
                        .orElse(null);
            }

            if (targetMed == null) {
                List<Medicine> all = medicineRepository.findAll();
                if (!all.isEmpty()) targetMed = all.get(0);
            }

            if (targetMed != null) {
                Inventory batch = new Inventory();
                batch.setMedicine(targetMed);
                batch.setBatchNumber("REC-" + order.getPoNumber());
                int qty = order.getItemCount() != null && order.getItemCount() > 0 ? order.getItemCount() : 100;
                batch.setQuantity(qty);
                batch.setManufacturingDate(LocalDate.now());
                batch.setExpiryDate(LocalDate.now().plusYears(2));
                batch.setStockStatus("IN_STOCK");
                Inventory savedBatch = inventoryRepository.save(batch);

                StockLog log = new StockLog();
                log.setInventoryId(savedBatch.getId());
                log.setMovementType("RESTOCK");
                log.setQuantityChanged(qty);
                log.setLogDate(LocalDate.now());
                stockLogRepository.save(log);
            }
        }

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        if (purchaseOrderRepository.existsById(id)) {
            purchaseOrderRepository.deleteById(id);
            return ResponseEntity.ok("Purchase order deleted successfully.");
        }
        return ResponseEntity.notFound().build();
    }
}