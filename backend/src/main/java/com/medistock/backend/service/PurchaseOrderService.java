package com.medistock.backend.service;

import com.medistock.backend.dto.request.PurchaseOrderRequest;
import com.medistock.backend.entity.PurchaseOrder;

import java.util.List;

public interface PurchaseOrderService {
    List<PurchaseOrder> getAllOrders();
    PurchaseOrder getOrderById(Integer id);
    PurchaseOrder createOrder(PurchaseOrderRequest request, String email);
    PurchaseOrder updateOrderStatus(Integer id, String status, String email);
}
