package com.example.backend;

import com.example.backend.dto.PurchaseOrderDetailsDto;
import com.example.backend.dto.PurchaseOrderListDto;
import com.example.backend.dto.PurchaseOrderStatusHistoryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;
    private final PurchaseOrderStatusHistoryRepository statusHistoryRepository;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService, PurchaseOrderStatusHistoryRepository statusHistoryRepository) {
        this.purchaseOrderService = purchaseOrderService;
        this.statusHistoryRepository = statusHistoryRepository;
    }

    // Pharmacist: Create PO
    @PostMapping("/pharmacist/purchase-orders")
    public ResponseEntity<?> create(
            @RequestBody PurchaseOrderService.PurchaseOrderCreateRequest request,
            Principal principal
    ) {
        String poNumber = purchaseOrderService.createPurchaseOrder(request, principal);
        return ResponseEntity.ok(Map.of("poNumber", poNumber));
    }

    // Admin: List & Details
    @GetMapping("/admin/purchase-orders")
    public ResponseEntity<List<PurchaseOrderListDto>> listAdmin() {
        return ResponseEntity.ok(purchaseOrderService.listForAdmin());
    }

    @GetMapping("/admin/purchase-orders/{poNumber}")
    public ResponseEntity<PurchaseOrderDetailsDto> detailsAdmin(@PathVariable String poNumber) {
        return ResponseEntity.ok(purchaseOrderService.getDetails(poNumber));
    }

    @PostMapping("/admin/purchase-orders/{poNumber}/approve")
    public ResponseEntity<?> approve(
            @PathVariable String poNumber,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal
    ) {
        String remarks = body == null ? null : body.get("remarks");
        purchaseOrderService.approveOrReject(poNumber, true, remarks, principal);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/purchase-orders/{poNumber}/reject")
    public ResponseEntity<?> reject(
            @PathVariable String poNumber,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal
    ) {
        String remarks = body == null ? null : body.get("remarks");
        purchaseOrderService.approveOrReject(poNumber, false, remarks, principal);
        return ResponseEntity.ok().build();
    }

    // Supplier: assigned POs
    @GetMapping("/supplier/purchase-orders")
    public ResponseEntity<List<PurchaseOrderListDto>> listSupplier(Principal principal) {
        // Map logged-in Supplier user to suppliers table via email.
        // JWT/Principal name is user email.
        return ResponseEntity.ok(purchaseOrderService.listForSupplierForPrincipal(principal));
    }

    @GetMapping("/supplier/purchase-orders/{poNumber}")
    public ResponseEntity<PurchaseOrderDetailsDto> detailsSupplier(@PathVariable String poNumber) {
        return ResponseEntity.ok(purchaseOrderService.getDetails(poNumber));
    }


    @PostMapping("/supplier/purchase-orders/{poNumber}/accept")
    public ResponseEntity<?> accept(
            @PathVariable String poNumber,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal
    ) {
        String remarks = body == null ? null : body.get("remarks");
        purchaseOrderService.supplierAcceptOrDecline(poNumber, true, remarks, principal, null);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/supplier/purchase-orders/{poNumber}/decline")
    public ResponseEntity<?> decline(
            @PathVariable String poNumber,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal
    ) {
        String remarks = body == null ? null : body.get("remarks");
        purchaseOrderService.supplierAcceptOrDecline(poNumber, false, remarks, principal, null);
        return ResponseEntity.ok().build();
    }

    // Staff: awaiting receipt
    @GetMapping("/staff/purchase-orders/awaiting-receipt")
    public ResponseEntity<List<PurchaseOrderListDto>> listAwaitingReceipt() {
        return ResponseEntity.ok(purchaseOrderService.listAwaitingReceiptForStaff());
    }

    @PostMapping("/staff/purchase-orders/{poNumber}/confirm-receipt")
    public ResponseEntity<?> confirmReceipt(
            @PathVariable String poNumber,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal
    ) {
        String remarks = body == null ? null : body.get("remarks");
        purchaseOrderService.confirmReceipt(poNumber, remarks, principal);
        return ResponseEntity.ok().build();
    }

    // Admin timeline: all status history in ascending changed_at
    @GetMapping("/admin/purchase-order-status-history")
    public ResponseEntity<List<PurchaseOrderStatusHistoryDto>> timeline() {
        return ResponseEntity.ok(
                statusHistoryRepository.findAll().stream()
                        .sorted((a, b) -> {
                            if (a.getChangedAt() == null && b.getChangedAt() == null) return 0;
                            if (a.getChangedAt() == null) return -1;
                            if (b.getChangedAt() == null) return 1;
                            return a.getChangedAt().compareTo(b.getChangedAt());
                        })
                        .map(h -> {
                            PurchaseOrderStatusHistoryDto dto = new PurchaseOrderStatusHistoryDto();
                            dto.setStatus(h.getStatus());
                            dto.setUserName(h.getChangedBy().getName());
                            dto.setChangedAt(h.getChangedAt());
                            dto.setRemarks(h.getRemarks());
                            return dto;
                        })
                        .toList()
        );
    }
}

