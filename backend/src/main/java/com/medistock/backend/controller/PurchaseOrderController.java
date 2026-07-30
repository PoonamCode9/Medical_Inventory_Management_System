package com.medistock.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.medistock.backend.dto.PurchaseOrderRequest;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.service.PurchaseOrderService;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    // Get All
    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    // Search
    @GetMapping("/search")
    public List<PurchaseOrder> searchPurchaseOrders(
            @RequestParam String keyword) {

        return purchaseOrderService.searchPurchaseOrders(keyword);
    }

    // Create
    @PostMapping
    public PurchaseOrder createPurchaseOrder(
            @RequestBody PurchaseOrderRequest request) {

        return purchaseOrderService.createPurchaseOrder(request);
    }

    // Update
    @PutMapping("/{id}")
    public PurchaseOrder updatePurchaseOrder(
            @PathVariable Integer id,
            @RequestBody PurchaseOrderRequest request) {

        return purchaseOrderService.updatePurchaseOrder(id, request);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void deletePurchaseOrder(@PathVariable Integer id) {

        purchaseOrderService.deletePurchaseOrder(id);
    }
}