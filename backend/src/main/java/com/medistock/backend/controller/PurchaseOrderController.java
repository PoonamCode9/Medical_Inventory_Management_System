package com.medistock.backend.controller;

import com.medistock.backend.model.Medicine;
import com.medistock.backend.model.PurchaseOrder;
import com.medistock.backend.model.StockLog;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.StockLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:3000")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private StockLogRepository stockLogRepository;

    @PostMapping
    public ResponseEntity<PurchaseOrder> createOrder(
            @RequestBody PurchaseOrder order) {
        return ResponseEntity.ok(
            purchaseOrderRepository.save(order));
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllOrders() {
        return ResponseEntity.ok(
            purchaseOrderRepository
                .findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<PurchaseOrder>> getBySupplier(
            @PathVariable Long supplierId) {
        return ResponseEntity.ok(
            purchaseOrderRepository
                .findBySupplierId(supplierId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PurchaseOrder> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        PurchaseOrder order = purchaseOrderRepository
            .findById(id)
            .orElseThrow(() ->
                new RuntimeException("Order not found!"));

        String previousStatus = order.getStatus();
        order.setStatus(status);
        PurchaseOrder updated = purchaseOrderRepository.save(order);

        // When order is DELIVERED → update medicine stock!
        if (status.equals("DELIVERED") &&
                !previousStatus.equals("DELIVERED")) {

            // Find medicine by name
            List<Medicine> medicines = medicineRepository
                .findByNameContainingIgnoreCase(
                    order.getMedicineName());

            if (!medicines.isEmpty()) {
                Medicine medicine = medicines.get(0);
                int previousQty = medicine.getQuantity();
                int newQty = previousQty + order.getQuantity();

                // Update quantity
                medicine.setQuantity(newQty);

                // Update status
                if (newQty == 0) medicine.setStatus("OUT_OF_STOCK");
                else if (newQty < 10) medicine.setStatus("LOW_STOCK");
                else medicine.setStatus("IN_STOCK");

                medicineRepository.save(medicine);

                // Log the stock change
                StockLog log = new StockLog();
                log.setMedicineId(medicine.getId());
                log.setMedicineName(medicine.getName());
                log.setActionType("RESTOCKED");
                log.setQuantityChanged(order.getQuantity());
                log.setPreviousQuantity(previousQty);
                log.setNewQuantity(newQty);
                log.setPerformedBy("Supplier: " +
                    order.getSupplierName());
                stockLogRepository.save(log);
            }
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable Long id) {
        purchaseOrderRepository.deleteById(id);
        return ResponseEntity.ok("Order deleted!");
    }
}