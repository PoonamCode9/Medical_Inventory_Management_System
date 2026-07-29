package com.medistock.backend.controller;

import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.StockLog;
import com.medistock.backend.service.InventoryService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<com.medistock.backend.dto.response.InventoryResponse>>> getAllInventory() {
        log.info("Request to fetch all inventory levels");
        List<com.medistock.backend.dto.response.InventoryResponse> responseList = inventoryService.getAllInventory().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<com.medistock.backend.dto.response.InventoryResponse>>builder()
                .success(true)
                .message("Fetched inventory list.")
                .data(responseList)
                .build());
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<com.medistock.backend.dto.response.StockLogResponse>>> getStockLogs() {
        log.info("Request to fetch all stock movement logs");
        List<com.medistock.backend.dto.response.StockLogResponse> logs = inventoryService.getStockLogs().stream()
                .map(this::mapToStockLogResponse)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<com.medistock.backend.dto.response.StockLogResponse>>builder()
                .success(true)
                .message("Fetched stock transaction logs.")
                .data(logs)
                .build());
    }

    @PostMapping("/stock-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<com.medistock.backend.dto.response.InventoryResponse>> stockIn(
            @RequestBody StockRequest request,
            Principal principal) {
        log.info("Request to stock in medicine ID: {}", request.getMedicineId());
        Inventory data = inventoryService.stockIn(
                request.getMedicineId(), 
                request.getQuantity(), 
                request.getReason(),
                principal.getName()
        );
        return ResponseEntity.ok(ApiResponse.<com.medistock.backend.dto.response.InventoryResponse>builder()
                .success(true)
                .message("Stock added successfully.")
                .data(mapToResponse(data))
                .build());
    }

    @PostMapping("/stock-out")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<com.medistock.backend.dto.response.InventoryResponse>> stockOut(
            @RequestBody StockRequest request,
            Principal principal) {
        log.info("Request to stock out medicine ID: {}", request.getMedicineId());
        Inventory data = inventoryService.stockOut(
                request.getMedicineId(), 
                request.getQuantity(), 
                request.getReason(),
                principal.getName()
        );
        return ResponseEntity.ok(ApiResponse.<com.medistock.backend.dto.response.InventoryResponse>builder()
                .success(true)
                .message("Stock dispensed successfully.")
                .data(mapToResponse(data))
                .build());
    }

    @PostMapping("/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<com.medistock.backend.dto.response.InventoryResponse>> adjustStock(
            @RequestBody StockRequest request,
            Principal principal) {
        log.info("Request to adjust stock for medicine ID: {}", request.getMedicineId());
        Inventory data = inventoryService.adjustStock(
                request.getMedicineId(), 
                request.getQuantity(), 
                request.getMinimumStock(), 
                request.getMaximumStock(),
                request.getReason(),
                principal.getName()
        );
        return ResponseEntity.ok(ApiResponse.<com.medistock.backend.dto.response.InventoryResponse>builder()
                .success(true)
                .message("Stock adjusted successfully.")
                .data(mapToResponse(data))
                .build());
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<com.medistock.backend.dto.response.InventoryResponse>>> getLowStockInventory() {
        log.info("Request to fetch low stock inventory levels");
        List<com.medistock.backend.dto.response.InventoryResponse> responseList = inventoryService.getAllInventory().stream()
                .filter(item -> item.getQuantity() <= (item.getMinimumStock() != null ? item.getMinimumStock() : 10))
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<com.medistock.backend.dto.response.InventoryResponse>>builder()
                .success(true)
                .message("Fetched low stock inventory list.")
                .data(responseList)
                .build());
    }

    private com.medistock.backend.dto.response.InventoryResponse mapToResponse(Inventory inventory) {
        if (inventory == null) return null;
        
        Medicine medicine = inventory.getMedicine();
        com.medistock.backend.dto.response.MedicineResponse medResponse = null;
        
        if (medicine != null) {
            String catName = medicine.getCategory() != null ? medicine.getCategory().getCategoryName() : "General";
            Integer catId = medicine.getCategory() != null ? medicine.getCategory().getCategoryId() : null;
            String suppName = medicine.getSupplier() != null ? medicine.getSupplier().getSupplierName() : "Default Supplier";
            Integer suppId = medicine.getSupplier() != null ? medicine.getSupplier().getSupplierId() : null;
            String suppEmail = medicine.getSupplier() != null ? medicine.getSupplier().getEmail() : "";
            String suppPhone = medicine.getSupplier() != null ? medicine.getSupplier().getPhone() : "";
 
            medResponse = com.medistock.backend.dto.response.MedicineResponse.builder()
                    .medicineId(medicine.getMedicineId())
                    .medicineName(medicine.getMedicineName())
                    .genericName(medicine.getGenericName())
                    .categoryId(catId)
                    .categoryName(catName)
                    .supplierId(suppId)
                    .supplierName(suppName)
                    .supplierEmail(suppEmail)
                    .supplierPhone(suppPhone)
                    .batchNumber(medicine.getBatchNumber())
                    .manufacturer(medicine.getManufacturer())
                    .manufactureDate(medicine.getManufactureDate())
                    .expiryDate(medicine.getExpiryDate())
                    .purchasePrice(medicine.getPurchasePrice())
                    .sellingPrice(medicine.getSellingPrice())
                    .gst(medicine.getGst())
                    .quantity(inventory.getQuantity())
                    .minimumStock(inventory.getMinimumStock())
                    .barcode(medicine.getBarcode())
                    .imageUrl(medicine.getImageUrl())
                    .description(medicine.getDescription())
                    .dosage(medicine.getDosage())
                    .unit(medicine.getUnit())
                    .build();
        }
 
        return com.medistock.backend.dto.response.InventoryResponse.builder()
                .inventoryId(inventory.getInventoryId())
                .medicine(medResponse)
                .quantity(inventory.getQuantity())
                .minimumStock(inventory.getMinimumStock())
                .maximumStock(inventory.getMaximumStock())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    private com.medistock.backend.dto.response.StockLogResponse mapToStockLogResponse(StockLog logEntry) {
        if (logEntry == null) return null;
 
        com.medistock.backend.dto.response.StockLogResponse.MedicineDto medicineDto = null;
        if (logEntry.getMedicine() != null) {
            medicineDto = com.medistock.backend.dto.response.StockLogResponse.MedicineDto.builder()
                    .medicineId(logEntry.getMedicine().getMedicineId())
                    .medicineName(logEntry.getMedicine().getMedicineName())
                    .batchNumber(logEntry.getMedicine().getBatchNumber())
                    .build();
        }
 
        com.medistock.backend.dto.response.StockLogResponse.UserDto userDto = null;
        if (logEntry.getUser() != null) {
            userDto = com.medistock.backend.dto.response.StockLogResponse.UserDto.builder()
                    .userId(logEntry.getUser().getUserId())
                    .email(logEntry.getUser().getEmail())
                    .build();
        }
 
        return com.medistock.backend.dto.response.StockLogResponse.builder()
                .stockLogId(logEntry.getStockLogId())
                .action(logEntry.getAction())
                .oldQuantity(logEntry.getOldQuantity())
                .newQuantity(logEntry.getNewQuantity())
                .reason(logEntry.getReason())
                .updatedAt(logEntry.getUpdatedAt())
                .medicine(medicineDto)
                .user(userDto)
                .build();
    }
 
    @Data
    public static class StockRequest {
        private Integer medicineId;
        private Integer quantity;
        private Integer minimumStock;
        private Integer maximumStock;
        private String reason;
    }
}
