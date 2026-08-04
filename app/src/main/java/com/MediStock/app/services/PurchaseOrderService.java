package com.MediStock.app.services;

import com.MediStock.app.dto.PurchaseOrderRequest;
import com.MediStock.app.dto.PurchaseOrderResponse;
import com.MediStock.app.dto.PurchaseOrderSummaryResponse;
import com.MediStock.app.enums.PurchaseOrderStatus;

import java.util.List;

public interface PurchaseOrderService {

    List<PurchaseOrderResponse> getAllPurchaseOrders();

    PurchaseOrderResponse getPurchaseOrderById(Long orderId);

    PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request);

    PurchaseOrderResponse updatePurchaseOrder(Long orderId,
                                              PurchaseOrderRequest request);

    void deletePurchaseOrder(Long orderId);

    PurchaseOrderSummaryResponse getPurchaseOrderSummary();

    List<PurchaseOrderResponse> searchBySupplier(Long supplierId);

    List<PurchaseOrderResponse> searchByStatus(PurchaseOrderStatus status);

}