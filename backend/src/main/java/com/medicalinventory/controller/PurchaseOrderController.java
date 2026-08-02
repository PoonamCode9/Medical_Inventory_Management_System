package com.medicalinventory.controller;

import com.medicalinventory.entity.PurchaseOrder;
import com.medicalinventory.service.PurchaseOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchase-orders")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @PostMapping
    public PurchaseOrder addPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
        System.out.println("Items = " + purchaseOrder.getItems());
        return purchaseOrderService.addPurchaseOrder(purchaseOrder);
    }

    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @GetMapping("/{id}")
    public PurchaseOrder getPurchaseOrderById(@PathVariable Long id) {
        return purchaseOrderService.getPurchaseOrderById(id);
    }

    @PutMapping("/{id}")
    public PurchaseOrder updatePurchaseOrder(@PathVariable Long id,
            @RequestBody PurchaseOrder purchaseOrder) {
        return purchaseOrderService.updatePurchaseOrder(id, purchaseOrder);
    }

    @DeleteMapping("/{id}")
    public void deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrder(id);
    }
}