package com.medistock.api.services;

import com.medistock.api.dto.*;
import com.medistock.api.models.*;
import com.medistock.api.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineService medicineService;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
                                SupplierRepository supplierRepository,
                                MedicineService medicineService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
        this.medicineService = medicineService;
    }

    public Page<PurchaseOrderDTO> getAllOrders(Pageable pageable) {
        return purchaseOrderRepository.findAllByOrderByOrderDateDesc(pageable)
                .map(this::mapToDTO);
    }

    public PurchaseOrderDTO getOrderById(Long id) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found: " + id));
        return mapToDTO(order);
    }

    @Transactional
    public PurchaseOrderDTO createOrder(PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + request.getSupplierId()));

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setStatus(PurchaseOrderStatus.PENDING);
        
        double totalAmount = 0.0;
        
        for (PurchaseOrderItemRequest itemReq : request.getItems()) {
            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setPurchaseOrder(order);
            item.setMedicineName(itemReq.getMedicineName());
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(itemReq.getUnitPrice());
            
            order.getItems().add(item);
            totalAmount += (item.getQuantity() * item.getUnitPrice());
        }
        
        order.setTotalAmount(totalAmount);
        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    @Transactional
    public PurchaseOrderDTO updateOrderStatus(Long id, PurchaseOrderStatus newStatus, String username) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found: " + id));

        // If it was already received or cancelled, don't allow changing status
        if (order.getStatus() == PurchaseOrderStatus.RECEIVED || order.getStatus() == PurchaseOrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot change status of a " + order.getStatus() + " order");
        }

        order.setStatus(newStatus);
        
        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);
        
        if (newStatus == PurchaseOrderStatus.RECEIVED) {
            autoReceiveStock(savedOrder, username);
        }
        
        return mapToDTO(savedOrder);
    }
    
    private void autoReceiveStock(PurchaseOrder order, String username) {
        // Attempt to adjust stock for existing medicines based on name matching
        for (PurchaseOrderItem item : order.getItems()) {
            try {
                // We'll need a new method in MedicineService to adjust by name, 
                // or just leave it manual for now to avoid creating duplicates.
                // Let's call a specialized method in MedicineService
                medicineService.adjustStockByName(item.getMedicineName(), item.getQuantity(), 
                        StockMovementType.IN, "PO #" + order.getId() + " Received", username, order.getSupplier());
            } catch (Exception e) {
                // Log and continue, some items might need manual entry if not found
                System.err.println("Could not auto-receive item " + item.getMedicineName() + ": " + e.getMessage());
            }
        }
    }

    @Transactional
    public void deleteOrder(Long id) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found: " + id));
                
        if (order.getStatus() == PurchaseOrderStatus.RECEIVED) {
            throw new RuntimeException("Cannot delete a received order");
        }
        
        purchaseOrderRepository.delete(order);
    }

    private PurchaseOrderDTO mapToDTO(PurchaseOrder order) {
        PurchaseOrderDTO dto = new PurchaseOrderDTO();
        dto.setId(order.getId());
        dto.setSupplierId(order.getSupplier().getId());
        dto.setSupplierName(order.getSupplier().getName());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(this::mapItemToDTO).collect(Collectors.toList()));
        }
        
        return dto;
    }

    private PurchaseOrderItemDTO mapItemToDTO(PurchaseOrderItem item) {
        PurchaseOrderItemDTO dto = new PurchaseOrderItemDTO();
        dto.setId(item.getId());
        dto.setMedicineName(item.getMedicineName());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        return dto;
    }
}
