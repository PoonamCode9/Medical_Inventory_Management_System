package com.MediStock.app.controllers;

import com.MediStock.app.dto.PurchaseOrderRequest;
import com.MediStock.app.dto.PurchaseOrderResponse;
import com.MediStock.app.dto.PurchaseOrderSummaryResponse;
import com.MediStock.app.enums.PurchaseOrderStatus;
import com.MediStock.app.services.PurchaseOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<List<PurchaseOrderResponse>> getAllPurchaseOrders() {

        return ResponseEntity.ok(
                purchaseOrderService.getAllPurchaseOrders()
        );
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<PurchaseOrderResponse> getPurchaseOrderById(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                purchaseOrderService.getPurchaseOrderById(orderId)
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<PurchaseOrderResponse> createPurchaseOrder(
            @RequestBody PurchaseOrderRequest request) {

        PurchaseOrderResponse response =
                purchaseOrderService.createPurchaseOrder(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<PurchaseOrderResponse> updatePurchaseOrder(
            @PathVariable Long orderId,
            @RequestBody PurchaseOrderRequest request) {

        return ResponseEntity.ok(
                purchaseOrderService.updatePurchaseOrder(orderId, request)
        );
    }

    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePurchaseOrder(
            @PathVariable Long orderId) {

        purchaseOrderService.deletePurchaseOrder(orderId);

        return ResponseEntity.ok("Purchase Order deleted successfully.");
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<PurchaseOrderSummaryResponse> getPurchaseOrderSummary() {

        return ResponseEntity.ok(
                purchaseOrderService.getPurchaseOrderSummary()
        );
    }

    @GetMapping("/supplier/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<List<PurchaseOrderResponse>> searchBySupplier(
            @PathVariable Long supplierId) {

        return ResponseEntity.ok(
                purchaseOrderService.searchBySupplier(supplierId)
        );
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<List<PurchaseOrderResponse>> searchByStatus(
            @PathVariable String status) {

        PurchaseOrderStatus purchaseOrderStatus;

        try {
            purchaseOrderStatus = PurchaseOrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid Purchase Order Status");
        }

        return ResponseEntity.ok(
                purchaseOrderService.searchByStatus(purchaseOrderStatus)
        );
    }

}