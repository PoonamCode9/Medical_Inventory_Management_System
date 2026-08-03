package com.medicalinventory.backend.service;

import com.medicalinventory.backend.dto.PurchaseOrderDTO;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.PurchaseOrder;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.InventoryRepository;
import com.medicalinventory.backend.repository.PurchaseOrderRepository;
import com.medicalinventory.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final InventoryRepository inventoryRepository;
    private final StockLogService stockLogService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
                               InventoryRepository inventoryRepository,
                               StockLogService stockLogService, 
                               UserRepository userRepository,
                               NotificationService notificationService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockLogService = stockLogService;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Transactional
    public PurchaseOrder createOrder(PurchaseOrder order) {
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDate.now());
        }
        order.setStatus("PENDING");
        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

        String medName = (savedOrder.getMedicine() != null) ? savedOrder.getMedicine().getMedicineName() : "Item";
        String message = "New purchase order placed for " + medName + " (Quantity: " + savedOrder.getQuantity() + ").";
        
        notificationService.createNotification(
            savedOrder.getMedicine(),
            "ORDER_CREATED",
            message,
            "Push"
        );

        return savedOrder;
    }

    @Transactional
    public PurchaseOrder cancelOrder(Long orderId) {
        PurchaseOrder order = purchaseOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + orderId));

        order.setStatus("CANCELLED");
        PurchaseOrder updatedOrder = purchaseOrderRepository.save(order);

        String medName = (updatedOrder.getMedicine() != null) ? updatedOrder.getMedicine().getMedicineName() : "Item";
        String message = "Purchase order for " + medName + " has been cancelled.";

        notificationService.createNotification(
            updatedOrder.getMedicine(),
            "ORDER_CANCELLED",
            message,
            "Push"
        );

        return updatedOrder;
    }

    @Transactional
    public PurchaseOrder receiveOrder(Long orderId, PurchaseOrderDTO dto) {
        PurchaseOrder order = purchaseOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + orderId));

        int recQty = dto.getReceivedQuantity() != null ? dto.getReceivedQuantity() : 0;
        int damQty = dto.getDamagedQuantity() != null ? dto.getDamagedQuantity() : 0;

        int goodQty = recQty - damQty;

        order.setReceivedQuantity(recQty);
        order.setDamagedQuantity(damQty);
        order.setRemarks(dto.getRemarks());

        if (recQty == order.getQuantity() && damQty == 0) {
            order.setStatus("DELIVERED");
        } else {
            order.setStatus("PARTIALLY_DELIVERED");
        }

        if (goodQty > 0) {
            Inventory inventory = inventoryRepository.findByMedicine(order.getMedicine())
                    .orElseGet(() -> {
                        Inventory newInv = new Inventory();
                        newInv.setMedicine(order.getMedicine());
                        newInv.setQuantity(0);
                        return newInv;
                    });

            int beforeQty = inventory.getQuantity() != null ? inventory.getQuantity() : 0;
            int afterQty = beforeQty + goodQty;

            inventory.setQuantity(afterQty);
            inventoryRepository.save(inventory);

            String supplierName = (order.getSupplier() != null) ? order.getSupplier().getSupplierName() : "Supplier";
            
            String remarks = "Stock received from " + supplierName;
            if (damQty > 0) {
                remarks += " - " + damQty + " damaged items reported";
            }

            stockLogService.createLog(
                order.getMedicine(),
                goodQty,
                "PURCHASE_RECEIVE",
                remarks,
                beforeQty,
                afterQty,
                getPerformedBy()
            );
        }

        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

        String medName = (savedOrder.getMedicine() != null) ? savedOrder.getMedicine().getMedicineName() : "Item";
        String statusMsg = savedOrder.getStatus().equals("DELIVERED") ? "fully delivered" : "partially delivered";
        
        String notifMessage = "Order for " + medName + " is " + statusMsg + ". Received: " + recQty + ", Damaged: " + damQty + ".";

        notificationService.createNotification(
            savedOrder.getMedicine(),
            "ORDER_" + savedOrder.getStatus(),
            notifMessage,
            "Push"
        );

        return savedOrder;
    }

    private String getPerformedBy() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getFullName();
    }
}