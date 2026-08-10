package com.MediStock.app.services;

import com.MediStock.app.dto.PurchaseOrderRequest;
import com.MediStock.app.dto.PurchaseOrderResponse;
import com.MediStock.app.dto.PurchaseOrderSummaryResponse;
import com.MediStock.app.entities.Medicine;
import com.MediStock.app.entities.PurchaseOrder;
import com.MediStock.app.entities.Supplier;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import com.MediStock.app.enums.PurchaseOrderStatus;
import com.MediStock.app.repositories.MedicineRepository;
import com.MediStock.app.repositories.PurchaseOrderRepository;
import com.MediStock.app.repositories.SupplierRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final SupplierRepository supplierRepository;

    private final MedicineRepository medicineRepository;

    private final ActivityLogService activityLogService;

    public PurchaseOrderServiceImpl(

            PurchaseOrderRepository purchaseOrderRepository,

            SupplierRepository supplierRepository,

            MedicineRepository medicineRepository,

            ActivityLogService activityLogService

    ) {

        this.purchaseOrderRepository = purchaseOrderRepository;

        this.supplierRepository = supplierRepository;

        this.medicineRepository = medicineRepository;

        this.activityLogService = activityLogService;

    }

    @Override
    public List<PurchaseOrderResponse> getAllPurchaseOrders() {

        return purchaseOrderRepository.findAll()

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }

    @Override
    public PurchaseOrderResponse getPurchaseOrderById(Long orderId) {

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository.findById(orderId)

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Purchase Order not found"));

        return mapToResponse(purchaseOrder);

    }

    @Override
    public PurchaseOrderResponse createPurchaseOrder(
            PurchaseOrderRequest request
    ) {

        Supplier supplier =
                supplierRepository.findById(
                        request.getSupplierId())

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Supplier not found"));

        Medicine medicine =
                medicineRepository.findById(
                        request.getMedicineId())

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Medicine not found"));

        PurchaseOrder purchaseOrder =
                new PurchaseOrder();

        purchaseOrder.setSupplierId(
                supplier.getSupplierId());

        purchaseOrder.setMedicineId(
                medicine.getMedicineId());

        purchaseOrder.setQuantity(
                request.getQuantity());

        purchaseOrder.setExpectedDeliveryDate(
                request.getExpectedDeliveryDate());

        purchaseOrder.setOrderDate(
                LocalDateTime.now());

        purchaseOrder.setStatus(
                PurchaseOrderStatus.PENDING);

        BigDecimal totalAmount =
                medicine.getPrice()

                        .multiply(

                                BigDecimal.valueOf(
                                        request.getQuantity())

                        );

        purchaseOrder.setTotalAmount(
                totalAmount);

        PurchaseOrder savedOrder =
                purchaseOrderRepository.save(
                        purchaseOrder);

        activityLogService.logActivity(

                ActivityModule.PURCHASE_ORDER,

                ActivityAction.CREATED,

                savedOrder.getOrderId(),

                "PO-" + savedOrder.getOrderId(),

                "Created purchase order for medicine: "
                        + medicine.getName()

        );

        return mapToResponse(savedOrder);

    }

    @Override
    public PurchaseOrderResponse updatePurchaseOrder(

            Long orderId,

            PurchaseOrderRequest request

    ) {

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository.findById(orderId)

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Purchase Order not found"));

        Supplier supplier =
                supplierRepository.findById(
                        request.getSupplierId())

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Supplier not found"));

        Medicine medicine =
                medicineRepository.findById(
                        request.getMedicineId())

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Medicine not found"));

        purchaseOrder.setSupplierId(
                supplier.getSupplierId());

        purchaseOrder.setMedicineId(
                medicine.getMedicineId());

        purchaseOrder.setQuantity(
                request.getQuantity());

        purchaseOrder.setExpectedDeliveryDate(
                request.getExpectedDeliveryDate());

        purchaseOrder.setStatus(
                request.getStatus());

        BigDecimal totalAmount =
                medicine.getPrice()

                        .multiply(

                                BigDecimal.valueOf(
                                        request.getQuantity())

                        );

        purchaseOrder.setTotalAmount(
                totalAmount);

        PurchaseOrder updatedOrder =
                purchaseOrderRepository.save(
                        purchaseOrder);

        ActivityAction action =
                ActivityAction.UPDATED;

        switch (updatedOrder.getStatus()) {

            case APPROVED ->
                    action = ActivityAction.APPROVED;

            case DELIVERED ->
                    action = ActivityAction.DELIVERED;

            case CANCELLED ->
                    action = ActivityAction.CANCELLED;

            default ->
                    action = ActivityAction.UPDATED;

        }

        activityLogService.logActivity(

                ActivityModule.PURCHASE_ORDER,

                action,

                updatedOrder.getOrderId(),

                "PO-" + updatedOrder.getOrderId(),

                action.name() +
                        " purchase order"

        );

        return mapToResponse(updatedOrder);

    }

    @Override
    public void deletePurchaseOrder(Long orderId) {

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository.findById(orderId)

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Purchase Order not found"));

        activityLogService.logActivity(

                ActivityModule.PURCHASE_ORDER,

                ActivityAction.DELETED,

                purchaseOrder.getOrderId(),

                "PO-" + purchaseOrder.getOrderId(),

                "Deleted purchase order"

        );

        purchaseOrderRepository.delete(
                purchaseOrder);

    }

        @Override
    public PurchaseOrderSummaryResponse getPurchaseOrderSummary() {

        List<PurchaseOrder> orders =
                purchaseOrderRepository.findAll();

        PurchaseOrderSummaryResponse summary =
                new PurchaseOrderSummaryResponse();

        summary.setTotalOrders(
                orders.size()
        );

        summary.setPendingOrders(

                (int) orders.stream()

                        .filter(order ->
                                order.getStatus() ==
                                        PurchaseOrderStatus.PENDING)

                        .count()

        );

        summary.setApprovedOrders(

                (int) orders.stream()

                        .filter(order ->
                                order.getStatus() ==
                                        PurchaseOrderStatus.APPROVED)

                        .count()

        );

        summary.setDeliveredOrders(

                (int) orders.stream()

                        .filter(order ->
                                order.getStatus() ==
                                        PurchaseOrderStatus.DELIVERED)

                        .count()

        );

        summary.setCancelledOrders(

                (int) orders.stream()

                        .filter(order ->
                                order.getStatus() ==
                                        PurchaseOrderStatus.CANCELLED)

                        .count()

        );

        BigDecimal totalValue =
                BigDecimal.ZERO;

        for (PurchaseOrder order : orders) {

            if (order.getTotalAmount() != null) {

                totalValue =
                        totalValue.add(
                                order.getTotalAmount()
                        );

            }

        }

        summary.setTotalOrderValue(
                totalValue
        );

        return summary;

    }

    @Override
    public List<PurchaseOrderResponse> searchBySupplier(
            Long supplierId
    ) {

        return purchaseOrderRepository

                .findBySupplierId(supplierId)

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }

    @Override
    public List<PurchaseOrderResponse> searchByStatus(
            PurchaseOrderStatus status
    ) {

        return purchaseOrderRepository

                .findByStatus(status)

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }

    private PurchaseOrderResponse mapToResponse(
            PurchaseOrder purchaseOrder
    ) {

        Supplier supplier =
                supplierRepository.findById(
                        purchaseOrder.getSupplierId()
                )

                .orElseThrow(() ->

                        new RuntimeException(
                                "Supplier not found"
                        ));

        Medicine medicine =
                medicineRepository.findById(
                        purchaseOrder.getMedicineId()
                )

                .orElseThrow(() ->

                        new RuntimeException(
                                "Medicine not found"
                        ));

        PurchaseOrderResponse response =
                new PurchaseOrderResponse();

        response.setOrderId(
                purchaseOrder.getOrderId()
        );

        response.setSupplierId(
                supplier.getSupplierId()
        );

        response.setSupplierName(
                supplier.getName()
        );

        response.setMedicineId(
                medicine.getMedicineId()
        );

        response.setMedicineName(
                medicine.getName()
        );

        response.setQuantity(
                purchaseOrder.getQuantity()
        );

        response.setOrderDate(
                purchaseOrder.getOrderDate()
        );

        response.setExpectedDeliveryDate(
                purchaseOrder.getExpectedDeliveryDate()
        );

        response.setStatus(
                purchaseOrder.getStatus()
        );

        response.setTotalAmount(
                purchaseOrder.getTotalAmount()
        );

        return response;

    }

}