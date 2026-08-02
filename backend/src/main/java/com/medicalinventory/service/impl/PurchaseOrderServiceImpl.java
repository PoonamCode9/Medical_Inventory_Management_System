package com.medicalinventory.service.impl;

import com.medicalinventory.entity.PurchaseOrder;
import com.medicalinventory.repository.PurchaseOrderRepository;
import com.medicalinventory.service.PurchaseOrderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderServiceImpl(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Override
    public PurchaseOrder addPurchaseOrder(PurchaseOrder purchaseOrder) {

        if (purchaseOrder.getItems() != null) {
            purchaseOrder.getItems().forEach(item -> item.setPurchaseOrder(purchaseOrder));
        }

        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));
    }

    @Override
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder purchaseOrder) {

        PurchaseOrder existingOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));

        existingOrder.setSupplier(purchaseOrder.getSupplier());
        existingOrder.setOrderDate(purchaseOrder.getOrderDate());
        existingOrder.setExpectedDelivery(purchaseOrder.getExpectedDelivery());
        existingOrder.setTotalAmount(purchaseOrder.getTotalAmount());
        existingOrder.setStatus(purchaseOrder.getStatus());

        return purchaseOrderRepository.save(existingOrder);
    }

    @Override
    public void deletePurchaseOrder(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));

        purchaseOrderRepository.delete(purchaseOrder);
    }
}