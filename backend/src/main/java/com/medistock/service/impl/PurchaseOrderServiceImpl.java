package com.medistock.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.entity.PurchaseOrder;
import com.medistock.repository.PurchaseOrderRepository;
import com.medistock.service.PurchaseOrderService;

@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderServiceImpl(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Override
    public PurchaseOrder addPurchaseOrder(PurchaseOrder purchaseOrder) {
        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id).orElse(null);
    }

    @Override
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder purchaseOrder) {

        PurchaseOrder existing = purchaseOrderRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setOrderDate(purchaseOrder.getOrderDate());
            existing.setQuantity(purchaseOrder.getQuantity());
            existing.setTotalAmount(purchaseOrder.getTotalAmount());
            existing.setSupplier(purchaseOrder.getSupplier());
            existing.setMedicine(purchaseOrder.getMedicine());

            return purchaseOrderRepository.save(existing);
        }

        return null;
    }

    @Override
    public void deletePurchaseOrder(Long id) {
        purchaseOrderRepository.deleteById(id);
    }
}