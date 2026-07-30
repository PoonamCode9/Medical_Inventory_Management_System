package com.medistock.backend.service;

import com.medistock.backend.dto.PurchaseDTO;
import com.medistock.backend.dto.PurchaseItemDTO;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.model.*;
import com.medistock.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseServiceImpl implements PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<PurchaseDTO> getAllPurchases() {
        return purchaseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PurchaseDTO getPurchaseById(Long id) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));
        return convertToDTO(purchase);
    }

    @Override
    public PurchaseDTO createPurchase(PurchaseDTO dto) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + dto.getSupplierId()));

        Purchase purchase = new Purchase();
        purchase.setSupplier(supplier);
        purchase.setPurchaseDate(LocalDateTime.now());
        purchase.setStatus(dto.getStatus() != null ? dto.getStatus() : "RECEIVED");

        BigDecimal total = BigDecimal.ZERO;
        BigDecimal gstTotal = BigDecimal.ZERO;

        List<PurchaseItem> items = new ArrayList<>();
        
        // Save the purchase first to get an ID for items
        Purchase savedPurchase = purchaseRepository.save(purchase);

        for (PurchaseItemDTO itemDto : dto.getItems()) {
            Medicine medicine = medicineRepository.findById(itemDto.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + itemDto.getMedicineId()));

            // Update cost price on medicine to match the latest purchase
            medicine.setCostPrice(itemDto.getUnitCostPrice());
            
            // Calculate item total cost
            BigDecimal itemTotal = itemDto.getUnitCostPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            total = total.add(itemTotal);

            // Seed GST (standard 12% for medicines in India)
            BigDecimal gst = itemTotal.multiply(BigDecimal.valueOf(0.12));
            gstTotal = gstTotal.add(gst);

            PurchaseItem item = new PurchaseItem();
            item.setPurchase(savedPurchase);
            item.setMedicine(medicine);
            item.setBatchNumber(itemDto.getBatchNumber());
            item.setQuantity(itemDto.getQuantity());
            item.setUnitCostPrice(itemDto.getUnitCostPrice());
            item.setExpiryDate(itemDto.getExpiryDate());
            items.add(item);

            // Handle Inventory Batch
            if ("RECEIVED".equals(savedPurchase.getStatus())) {
                Optional<Inventory> existingBatch = inventoryRepository.findByMedicineIdAndBatchNumber(medicine.getId(), itemDto.getBatchNumber());
                if (existingBatch.isPresent()) {
                    Inventory batch = existingBatch.get();
                    batch.setQuantity(batch.getQuantity() + itemDto.getQuantity());
                    inventoryRepository.save(batch);
                } else {
                    Inventory newBatch = new Inventory(
                            medicine,
                            itemDto.getBatchNumber(),
                            itemDto.getQuantity(),
                            itemDto.getExpiryDate(),
                            "General Shelf"
                    );
                    inventoryRepository.save(newBatch);
                }

                // Update total stock cached on medicine
                List<Inventory> allBatches = inventoryRepository.findByMedicineId(medicine.getId());
                int totalStock = allBatches.stream().mapToInt(Inventory::getQuantity).sum();
                medicine.setStockQuantity(totalStock);
                medicineRepository.save(medicine);
            }
        }

        savedPurchase.getItems().clear();
        savedPurchase.getItems().addAll(items);
        savedPurchase.setTotalAmount(total.add(gstTotal));
        savedPurchase.setGstAmount(gstTotal);
        
        Purchase finalSaved = purchaseRepository.save(savedPurchase);

        auditLogService.logAction("CREATE_PURCHASE_ORDER", "Created purchase order ID: " + finalSaved.getId() + " total: ₹" + finalSaved.getTotalAmount());
        
        notificationService.checkLowStockAndCreateNotifications();
        notificationService.checkExpiryAndCreateNotifications();

        return convertToDTO(finalSaved);
    }

    private PurchaseDTO convertToDTO(Purchase p) {
        PurchaseDTO dto = new PurchaseDTO();
        dto.setId(p.getId());
        dto.setSupplierId(p.getSupplier().getId());
        dto.setSupplierName(p.getSupplier().getName());
        dto.setPurchaseDate(p.getPurchaseDate());
        dto.setTotalAmount(p.getTotalAmount());
        dto.setGstAmount(p.getGstAmount());
        dto.setStatus(p.getStatus());
        dto.setItems(p.getItems().stream().map(item -> {
            PurchaseItemDTO itemDto = new PurchaseItemDTO();
            itemDto.setMedicineId(item.getMedicine().getId());
            itemDto.setMedicineName(item.getMedicine().getName());
            itemDto.setBatchNumber(item.getBatchNumber());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setUnitCostPrice(item.getUnitCostPrice());
            itemDto.setExpiryDate(item.getExpiryDate());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
