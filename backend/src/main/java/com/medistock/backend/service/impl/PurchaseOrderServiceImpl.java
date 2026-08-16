package com.medistock.backend.service.impl;

import com.medistock.backend.dto.request.PurchaseOrderItemRequest;
import com.medistock.backend.dto.request.PurchaseOrderRequest;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.entity.PurchaseOrderItem;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.entity.User;
import com.medistock.backend.entity.StockLog;
import com.medistock.backend.entity.Inventory;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.PurchaseOrderItemRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.repository.StockLogRepository;
import com.medistock.backend.service.InventoryService;
import com.medistock.backend.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;
    private final InventoryService inventoryService;
    private final com.medistock.backend.service.NotificationService notificationService;
    private final StockLogRepository stockLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrder getOrderById(Integer id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found with ID: " + id));
    }

    @Override
    @Transactional
    public PurchaseOrder createOrder(PurchaseOrderRequest request, String email) {
        if (request.getSupplierId() == null) {
            throw new IllegalArgumentException("Supplier ID is required.");
        }
        log.info("Request to create a new purchase order for supplier ID: {}", request.getSupplierId());

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + request.getSupplierId()));

        User orderedBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<PurchaseOrderItem> orderItems = new ArrayList<>();

        PurchaseOrder order = PurchaseOrder.builder()
                .supplier(supplier)
                .orderedBy(orderedBy)
                .orderDate(LocalDate.now())
                .status("PENDING")
                .items(orderItems)
                .build();

        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (PurchaseOrderItemRequest itemReq : request.getItems()) {
                if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                    throw new IllegalArgumentException("Purchase quantity must be positive. Provided: " + itemReq.getQuantity());
                }
                if (itemReq.getUnitPrice() != null && itemReq.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("Unit price cannot be negative.");
                }

                Medicine medicine = medicineRepository.findById(itemReq.getMedicineId())
                        .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + itemReq.getMedicineId()));

                BigDecimal itemPrice = itemReq.getUnitPrice() != null ? itemReq.getUnitPrice() : medicine.getPurchasePrice();
                if (itemPrice == null) {
                    itemPrice = BigDecimal.ZERO;
                }

                PurchaseOrderItem orderItem = PurchaseOrderItem.builder()
                        .purchaseOrder(savedOrder)
                        .medicine(medicine)
                        .quantity(itemReq.getQuantity())
                        .unitPrice(itemPrice)
                        .build();

                purchaseOrderItemRepository.save(orderItem);
                orderItems.add(orderItem);

                BigDecimal itemCost = itemPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
                calculatedTotal = calculatedTotal.add(itemCost);
            }
        } else {
            throw new IllegalArgumentException("Purchase Order must contain at least one medicine item.");
        }

        savedOrder.setTotalAmount(calculatedTotal);
        PurchaseOrder finalSaved = purchaseOrderRepository.save(savedOrder);

        // Generate stock log for PO creation
        for (PurchaseOrderItem item : finalSaved.getItems()) {
            int currentQty = item.getMedicine().getInventory() != null ? item.getMedicine().getInventory().getQuantity() : 0;
            StockLog logEntry = StockLog.builder()
                    .medicine(item.getMedicine())
                    .user(orderedBy)
                    .action("PURCHASE_ORDER_CREATED")
                    .oldQuantity(currentQty)
                    .newQuantity(currentQty)
                    .reason("Purchase Order PO-" + finalSaved.getPurchaseOrderId() + " created")
                    .updatedAt(LocalDateTime.now())
                    .build();
            stockLogRepository.save(logEntry);
        }

        notificationService.createNotification(
                null,
                "Purchase Order Created",
                "Purchase Order PO-" + finalSaved.getPurchaseOrderId() + " has been created for supplier: " + supplier.getSupplierName() + ".",
                "PURCHASE_CREATED",
                "MEDIUM",
                "PURCHASE",
                finalSaved.getPurchaseOrderId()
        );

        return finalSaved;
    }

    @Override
    @Transactional
    public PurchaseOrder updateOrderStatus(Integer id, String status, String email) {
        log.info("Updating status of purchase order ID: {} to: {}", id, status);
        PurchaseOrder order = getOrderById(id);
        String oldStatus = order.getStatus();

        if (oldStatus.equals(status)) {
            return order;
        }

        order.setStatus(status.toUpperCase());
        PurchaseOrder saved = purchaseOrderRepository.save(order);

        if ("APPROVED".equalsIgnoreCase(status)) {
            notificationService.createNotification(
                    null,
                    "Purchase Order Approved",
                    "Purchase Order PO-" + saved.getPurchaseOrderId() + " has been approved.",
                    "PURCHASE_APPROVED",
                    "MEDIUM",
                    "PURCHASE",
                    saved.getPurchaseOrderId()
            );
        }

        // Transition: Automatically update inventory stock when PO is RECEIVED or DELIVERED
        if ("RECEIVED".equalsIgnoreCase(status) || "DELIVERED".equalsIgnoreCase(status)) {
            log.info("Order RECEIVED/DELIVERED. Triggering automatic stock-in sync...");
            User operatorUser = userRepository.findByEmail(email).orElse(null);
            for (PurchaseOrderItem item : order.getItems()) {
                Inventory updatedInv = inventoryService.stockIn(
                        item.getMedicine().getMedicineId(), 
                        item.getQuantity(), 
                        "Received Purchase Order #PO-" + saved.getPurchaseOrderId(),
                        email
                );

                int finalQty = updatedInv != null ? updatedInv.getQuantity() : 0;
                StockLog logEntry = StockLog.builder()
                        .medicine(item.getMedicine())
                        .user(operatorUser)
                        .action("PURCHASE_ORDER_COMPLETED")
                        .oldQuantity(finalQty - item.getQuantity())
                        .newQuantity(finalQty)
                        .reason("Purchase Order PO-" + saved.getPurchaseOrderId() + " completed")
                        .updatedAt(LocalDateTime.now())
                        .build();
                stockLogRepository.save(logEntry);
            }
            notificationService.createNotification(
                    null,
                    "Purchase Order Delivered",
                    "Purchase Order PO-" + saved.getPurchaseOrderId() + " has been received.",
                    "PURCHASE_DELIVERED",
                    "HIGH",
                    "PURCHASE",
                    saved.getPurchaseOrderId()
            );
        }

        return saved;
    }
}
