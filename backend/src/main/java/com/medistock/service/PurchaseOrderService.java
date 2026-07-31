package com.medistock.service;

import java.util.List;
import com.medistock.entity.PurchaseOrder;

public interface PurchaseOrderService {

    PurchaseOrder addPurchaseOrder(PurchaseOrder purchaseOrder);

    List<PurchaseOrder> getAllPurchaseOrders();

    PurchaseOrder getPurchaseOrderById(Long id);

    PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder purchaseOrder);

    void deletePurchaseOrder(Long id);
}