package com.medistock.backend.controller;

import com.medistock.backend.dto.request.PurchaseOrderRequest;
import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.dto.response.PurchaseOrderResponse;
import com.medistock.backend.dto.response.PurchaseOrderItemResponse;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.service.PurchaseOrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
@Slf4j
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<PurchaseOrderResponse>>> getAllOrders() {
        log.info("Request to fetch all purchase orders");
        List<PurchaseOrderResponse> data = purchaseOrderService.getAllOrders().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<PurchaseOrderResponse>>builder()
                .success(true)
                .message("Fetched purchase orders list.")
                .data(data)
                .build());
    }

    @GetMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> getOrderById(@PathVariable Integer id) {
        log.info("Request to fetch purchase order ID: {}", id);
        PurchaseOrder po = purchaseOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.<PurchaseOrderResponse>builder()
                .success(true)
                .message("Fetched purchase order details.")
                .data(mapToResponse(po))
                .build());
    }

    @PostMapping
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> createOrder(
            @RequestBody PurchaseOrderRequest request,
            Principal principal) {
        log.info("Request to create purchase order from: {}", principal.getName());
        PurchaseOrder po = purchaseOrderService.createOrder(request, principal.getName());
        return ResponseEntity.ok(ApiResponse.<PurchaseOrderResponse>builder()
                .success(true)
                .message("Purchase order created successfully.")
                .data(mapToResponse(po))
                .build());
    }

    @PutMapping("/{id}/status")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> updateStatus(
            @PathVariable Integer id,
            @RequestBody StatusUpdateRequest request,
            Principal principal) {
        log.info("Request to set purchase order status ID: {} to: {}", id, request.getStatus());
        PurchaseOrder po = purchaseOrderService.updateOrderStatus(id, request.getStatus(), principal.getName());
        return ResponseEntity.ok(ApiResponse.<PurchaseOrderResponse>builder()
                .success(true)
                .message("Purchase order status updated successfully.")
                .data(mapToResponse(po))
                .build());
    }

    private PurchaseOrderResponse mapToResponse(PurchaseOrder po) {
        if (po == null) return null;

        PurchaseOrderResponse.SupplierDto supplierDto = null;
        if (po.getSupplier() != null) {
            supplierDto = PurchaseOrderResponse.SupplierDto.builder()
                    .supplierId(po.getSupplier().getSupplierId())
                    .supplierName(po.getSupplier().getSupplierName())
                    .build();
        }

        PurchaseOrderResponse.UserDto userDto = null;
        if (po.getOrderedBy() != null) {
            userDto = PurchaseOrderResponse.UserDto.builder()
                    .userId(po.getOrderedBy().getUserId())
                    .email(po.getOrderedBy().getEmail())
                    .build();
        }

        List<PurchaseOrderItemResponse> itemResponses = new java.util.ArrayList<>();
        if (po.getItems() != null) {
            for (com.medistock.backend.entity.PurchaseOrderItem item : po.getItems()) {
                itemResponses.add(PurchaseOrderItemResponse.builder()
                        .itemId(item.getItemId())
                        .medicineId(item.getMedicine() != null ? item.getMedicine().getMedicineId() : null)
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build());
            }
        }

        return PurchaseOrderResponse.builder()
                .purchaseOrderId(po.getPurchaseOrderId())
                .supplier(supplierDto)
                .orderedBy(userDto)
                .orderDate(po.getOrderDate() != null ? po.getOrderDate().toString() : null)
                .totalAmount(po.getTotalAmount())
                .status(po.getStatus())
                .items(itemResponses)
                .build();
    }

    @Data
    public static class StatusUpdateRequest {
        private String status;
    }
}
