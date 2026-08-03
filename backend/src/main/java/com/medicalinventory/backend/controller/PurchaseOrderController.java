package com.medicalinventory.backend.controller;

import com.medicalinventory.backend.dto.PurchaseOrderDTO;
import com.medicalinventory.backend.entity.PurchaseOrder;
import com.medicalinventory.backend.service.PurchaseOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllOrders() {
        return ResponseEntity.ok(purchaseOrderService.getAllOrders());
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> createOrder(@RequestBody PurchaseOrder order) {
        return ResponseEntity.ok(purchaseOrderService.createOrder(order));
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<PurchaseOrder> receiveOrder(@PathVariable Long id, @RequestBody PurchaseOrderDTO dto) {
        return ResponseEntity.ok(purchaseOrderService.receiveOrder(id, dto));
    }

    @PutMapping("/{id}/cancel")
public ResponseEntity<PurchaseOrder> cancelOrder(@PathVariable Long id) {
    return ResponseEntity.ok(purchaseOrderService.cancelOrder(id));
}
}