package com.medicalinventory.backend.service;

import com.medicalinventory.backend.dto.PurchaseOrderDTO;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.PurchaseOrder;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.InventoryRepository;
import com.medicalinventory.backend.repository.MedicineRepository;
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
    private final MedicineRepository medicineRepository;
    private final StockLogService stockLogService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
            InventoryRepository inventoryRepository,
            MedicineRepository medicineRepository,
            StockLogService stockLogService,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.inventoryRepository = inventoryRepository;
        this.medicineRepository = medicineRepository;
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

        if (order.getMedicine() != null && order.getMedicine().getMedicineId() != null) {
            Medicine medicine = medicineRepository.findById(order.getMedicine().getMedicineId())
                    .orElse(order.getMedicine());
            order.setMedicine(medicine);
        }

        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

        String medName = (savedOrder.getMedicine() != null && savedOrder.getMedicine().getMedicineName() != null)
                ? savedOrder.getMedicine().getMedicineName()
                : "Item";

        String message = "New purchase order created for " + medName + " (Quantity: " + savedOrder.getQuantity() + ").";

        notificationService.createNotification(
                savedOrder.getMedicine(),
                "ORDER_CREATED",
                message,
                "Both");

        return savedOrder;
    }

    @Transactional
    public PurchaseOrder cancelOrder(Long orderId) {
        PurchaseOrder order = purchaseOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + orderId));

        order.setStatus("CANCELLED");
        PurchaseOrder updatedOrder = purchaseOrderRepository.save(order);

        String medName = (updatedOrder.getMedicine() != null && updatedOrder.getMedicine().getMedicineName() != null)
                ? updatedOrder.getMedicine().getMedicineName()
                : "Item";

        String message = "Purchase order for " + medName + " has been CANCELLED.";

        notificationService.createNotification(
                updatedOrder.getMedicine(),
                "ORDER_CANCELLED",
                message,
                "Both");

        return updatedOrder;
    }

    @Transactional
    public PurchaseOrder receiveOrder(Long orderId, PurchaseOrderDTO dto) {
        PurchaseOrder order = purchaseOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + orderId));

        int orderedQty = order.getQuantity() != null ? order.getQuantity() : 0;
        int recQty = dto.getReceivedQuantity() != null ? dto.getReceivedQuantity() : 0;
        int inputDamQty = dto.getDamagedQuantity() != null ? dto.getDamagedQuantity() : 0;

        if (recQty > orderedQty) {
            recQty = orderedQty;
        }

        int finalDamQty;

        if (recQty >= orderedQty) {
            finalDamQty = 0;
            order.setStatus("DELIVERED");
        } else {
            int missingQty = orderedQty - recQty;

            if (inputDamQty > 0 && inputDamQty <= recQty) {
                finalDamQty = inputDamQty;
            } else {
                finalDamQty = missingQty;
            }

            order.setStatus("PARTIALLY_DELIVERED");
        }

        int goodQty = Math.max(0, recQty - (finalDamQty > (orderedQty - recQty) ? finalDamQty : 0));

        order.setReceivedQuantity(recQty);
        order.setDamagedQuantity(finalDamQty);
        order.setRemarks(dto.getRemarks());

        int finalUpdatedQty = 0;

        if (goodQty > 0) {
            Inventory inventory = inventoryRepository.findByMedicine(order.getMedicine())
                    .orElseGet(() -> {
                        Inventory newInv = new Inventory();
                        newInv.setMedicine(order.getMedicine());
                        newInv.setQuantity(0);
                        return newInv;
                    });

            int beforeQty = inventory.getQuantity() != null ? inventory.getQuantity() : 0;
            finalUpdatedQty = beforeQty + goodQty; 

            inventory.setQuantity(finalUpdatedQty);
            inventoryRepository.save(inventory);

            String supplierName = (order.getSupplier() != null) ? order.getSupplier().getSupplierName() : "Supplier";

            String remarks = "Stock received from " + supplierName;
            if (finalDamQty > 0) {
                remarks += " - " + finalDamQty + " damaged/shortage items reported";
            }

            stockLogService.createLog(
                    order.getMedicine(),
                    goodQty,
                    "PURCHASE_RECEIVED",
                    remarks,
                    beforeQty,
                    finalUpdatedQty,
                    getPerformedBy());
        } else {
            finalUpdatedQty = inventoryRepository.findByMedicine(order.getMedicine())
                    .map(inv -> inv.getQuantity() != null ? inv.getQuantity() : 0)
                    .orElse(0);
        }

        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

        String medName = (savedOrder.getMedicine() != null && savedOrder.getMedicine().getMedicineName() != null)
                ? savedOrder.getMedicine().getMedicineName()
                : "Item";

        String statusMsg = "DELIVERED".equals(savedOrder.getStatus()) ? "fully delivered" : "partially delivered";

        String notifMessage = "Order for " + medName + " is " + statusMsg + ". Received: " + recQty
                + ", Damaged/Short: " + finalDamQty + ".";

        notificationService.createNotification(
                savedOrder.getMedicine(),
                "ORDER_" + savedOrder.getStatus(),
                notifMessage,
                "Both");

        notificationService.checkAndTriggerLowStockNotification(savedOrder.getMedicine(), finalUpdatedQty);

        return savedOrder;
    }

    // get performed by (username)-
    private String getPerformedBy() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        String performedBy = user.getFullName();
        return performedBy;
    }
}