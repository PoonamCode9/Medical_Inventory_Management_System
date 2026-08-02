package com.medicalinventory.service;

import com.medicalinventory.entity.PurchaseOrder;

import java.util.List;

public interface PurchaseOrderService {

    PurchaseOrder addPurchaseOrder(PurchaseOrder purchaseOrder);

    List<PurchaseOrder> getAllPurchaseOrders();

    PurchaseOrder getPurchaseOrderById(Long id);

    PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder purchaseOrder);

    void deletePurchaseOrder(Long id);
}