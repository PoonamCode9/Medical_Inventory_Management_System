package com.medistock.controller;

import com.medistock.entity.PurchaseOrder;
import com.medistock.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin("*")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService service;

    @PostMapping
    public PurchaseOrder addPurchase(
            @RequestBody PurchaseOrder purchase){

        return service.addPurchase(purchase);

    }

    @GetMapping
    public List<PurchaseOrder> getPurchases(){

        return service.getPurchases();

    }

    @DeleteMapping("/{id}")
    public String deletePurchase(
            @PathVariable Long id){

        service.deletePurchase(id);

        return "Purchase Deleted";

    }
    @GetMapping("/count")
public long getPurchaseCount() {
    return service.getPurchaseCount();
}

}