package com.example.backend;

import com.example.backend.dto.*;
import com.example.backend.junction.SupplierMedicineService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

// (no additional imports)


@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final GoodsReceiptRepository goodsReceiptRepository;
    private final PurchaseOrderStatusHistoryRepository statusHistoryRepository;

    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    private final SupplierMedicineService supplierMedicineService;
    private final NotificationIntegrationService notificationIntegrationService;

    public PurchaseOrderService(
            PurchaseOrderRepository purchaseOrderRepository,
            PurchaseOrderItemRepository purchaseOrderItemRepository,
            GoodsReceiptRepository goodsReceiptRepository,
            PurchaseOrderStatusHistoryRepository statusHistoryRepository,
            SupplierRepository supplierRepository,
            MedicineRepository medicineRepository,
            UserRepository userRepository,
            SupplierMedicineService supplierMedicineService,
            NotificationIntegrationService notificationIntegrationService
    ) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
        this.goodsReceiptRepository = goodsReceiptRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.supplierRepository = supplierRepository;
        this.medicineRepository = medicineRepository;
        this.userRepository = userRepository;
        this.supplierMedicineService = supplierMedicineService;
        this.notificationIntegrationService = notificationIntegrationService;
    }

    private User requireUser(Principal principal) {
        if (principal == null || principal.getName() == null) {
            throw new SecurityException("Not authenticated");
        }
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private boolean isFinal(String overallStatus) {
        return "Completed".equalsIgnoreCase(overallStatus) || "Cancelled".equalsIgnoreCase(overallStatus);
    }

    private String generatePoNumber() {
        // DB unique constraint exists; loop defensively.
        String candidate;
        do {
            candidate = "PO-" + System.currentTimeMillis();
        } while (purchaseOrderRepository.existsByPoNumber(candidate));
        return candidate;
    }

    private void ensureNotFinal(PurchaseOrder po) {
        if (po == null) return;
        if (isFinal(po.getOverallStatus())) {
            throw new IllegalStateException("Completed or Cancelled purchase orders cannot be modified");
        }
    }

    private void addStatusHistory(PurchaseOrder po, String status, User changedBy, String remarks) {
        PurchaseOrderStatusHistory h = new PurchaseOrderStatusHistory();
        h.setPurchaseOrder(po);
        h.setStatus(status);
        h.setChangedBy(changedBy);
        h.setRemarks(remarks);
        h.setChangedAt(LocalDateTime.now());
        statusHistoryRepository.save(h);
    }

    @Transactional
    @PreAuthorize("hasRole('Pharmacist')")
    public String createPurchaseOrder(PurchaseOrderCreateRequest request, Principal principal) {
        if (request == null) throw new IllegalArgumentException("Request required");
        if (request.getSupplierId() == null) throw new IllegalArgumentException("Supplier must be selected");
        if (request.getItems() == null || request.getItems().isEmpty()) throw new IllegalArgumentException("At least one medicine is required");
        if (request.getRequiredDate() == null) throw new IllegalArgumentException("Required Date is required");

        User pharmacist = requireUser(principal);

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found"));

        // Validate duplicates + compute items
        Set<Integer> seenMedicineIds = new HashSet<>();
        List<PurchaseOrderCreateItem> items = request.getItems();

        for (PurchaseOrderCreateItem it : items) {
            if (it == null) throw new IllegalArgumentException("Item is required");
            if (it.getMedicineId() == null) throw new IllegalArgumentException("medicineId is required");
            if (!seenMedicineIds.add(it.getMedicineId())) {
                throw new IllegalArgumentException("Duplicate medicines are not allowed in one purchase order");
            }
            if (it.getQuantity() == null || it.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero");
            }
            if (it.getUnitPrice() == null) throw new IllegalArgumentException("Unit price is required");
            if (it.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Unit price cannot be negative");
            }
        }

        PurchaseOrder po = new PurchaseOrder();
        po.setSupplier(supplier);
        po.setCreatedBy(pharmacist);
        po.setOrderDate(LocalDate.now());
        po.setRequiredDate(request.getRequiredDate());
        po.setAdminStatus("Pending");
        po.setSupplierStatus("Pending");
        po.setReceivingStatus("Pending");
        po.setOverallStatus("Pending Admin");
        po.setPoNumber(generatePoNumber());

        PurchaseOrder saved = purchaseOrderRepository.save(po);

        // Load medicines and create items
        List<Integer> medicineIds = items.stream().map(PurchaseOrderCreateItem::getMedicineId).toList();
        List<Medicine> meds = medicineRepository.findAllById(medicineIds);
        Map<Integer, Medicine> medMap = meds.stream().collect(Collectors.toMap(Medicine::getId, m -> m));

        if (medMap.size() != new HashSet<>(medicineIds).size()) {
            Set<Integer> missing = new HashSet<>(medicineIds);
            missing.removeAll(medMap.keySet());
            throw new IllegalArgumentException("Invalid medicineId(s): " + missing);
        }

        List<PurchaseOrderItem> poItems = new ArrayList<>();
        for (PurchaseOrderCreateItem it : items) {
            Medicine m = medMap.get(it.getMedicineId());

            // Ensure supplier actually supplies the medicine (via junction)
            List<Integer> allowedSupplierIds = supplierMedicineService.getSupplierIdsForMedicine(m.getId());
            if (!allowedSupplierIds.contains(request.getSupplierId())) {
                throw new IllegalArgumentException("Selected supplier does not supply medicineId=" + m.getId());
            }

            PurchaseOrderItem poi = new PurchaseOrderItem();
            poi.setPurchaseOrder(saved);
            poi.setMedicine(m);
            poi.setQuantityOrdered(it.getQuantity());
            poi.setUnitPrice(it.getUnitPrice());
            poItems.add(poi);
        }

        saved.getItems().addAll(poItems);
        purchaseOrderRepository.save(saved);

        addStatusHistory(saved, "Pending Admin", pharmacist, "Purchase Order Created");

        // Notify admin about new PO
        notificationIntegrationService.notifyPOCreated(
                saved.getPoNumber(), saved.getId(), saved.getCreatedBy().getId());

        return saved.getPoNumber();
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderListDto> listForAdmin() {
        return purchaseOrderRepository.findAll().stream()
                .sorted(Comparator.comparing(PurchaseOrder::getOrderDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toListDto)
                .toList();
    }


    @Transactional(readOnly = true)
    public PurchaseOrderDetailsDto getDetails(String poNumber) {
        PurchaseOrder po = purchaseOrderRepository.findByPoNumber(poNumber)
                .orElseThrow(() -> new EntityNotFoundException("Purchase order not found"));

        PurchaseOrderDetailsDto dto = new PurchaseOrderDetailsDto();
        dto.setPoNumber(po.getPoNumber());
        dto.setSupplierId(po.getSupplier().getId());
        dto.setSupplierName(po.getSupplier().getName());
        dto.setRequiredDate(po.getRequiredDate());
        dto.setRequiredDateDisplay(po.getRequiredDate() == null ? null : po.getRequiredDate().toString());

        dto.setOverallStatus(po.getOverallStatus());
        dto.setAdminStatus(po.getAdminStatus());
        dto.setSupplierStatus(po.getSupplierStatus());
        dto.setReceivingStatus(po.getReceivingStatus());

        dto.setCreatedByName(po.getCreatedBy() != null ? po.getCreatedBy().getName() : null);

        List<PurchaseOrderItemDto> itemDtos = po.getItems().stream().map(it -> {
            PurchaseOrderItemDto id = new PurchaseOrderItemDto();
            id.setMedicineId(it.getMedicine().getId());
            id.setMedicineName(it.getMedicine().getName());
            id.setQuantityOrdered(it.getQuantityOrdered());
            id.setUnitPrice(it.getUnitPrice());
            id.setExpectedTotal(it.getExpectedTotal());
            return id;
        }).toList();
        dto.setItems(itemDtos);

        List<PurchaseOrderStatusHistory> history = statusHistoryRepository.findByPurchaseOrder_PoNumberOrderByChangedAtAsc(poNumber);
        List<PurchaseOrderStatusHistoryDto> histDtos = history.stream().map(h -> {
            PurchaseOrderStatusHistoryDto hd = new PurchaseOrderStatusHistoryDto();
            hd.setStatus(h.getStatus());
            hd.setUserName(h.getChangedBy().getName());
            hd.setChangedAt(h.getChangedAt());
            hd.setRemarks(h.getRemarks());
            return hd;
        }).toList();
        dto.setStatusHistory(histDtos);

        return dto;
    }

    @Transactional
    @PreAuthorize("hasRole('Admin')")
    public void approveOrReject(String poNumber, boolean approve, String adminRemarks, Principal principal) {
        PurchaseOrder po = purchaseOrderRepository.findByPoNumber(poNumber)
                .orElseThrow(() -> new EntityNotFoundException("Purchase order not found"));

        ensureNotFinal(po);

        User admin = requireUser(principal);

        if (approve) {
            po.setAdminStatus("Approved");
            po.setOverallStatus("Pending Supplier");
            po.setApprovedBy(admin);
            po.setAdminRemarks(adminRemarks);

            purchaseOrderRepository.save(po);
            addStatusHistory(po, "Pending Supplier", admin, adminRemarks);

            // Notify pharmacist that PO was approved
            notificationIntegrationService.notifyPOApprovedByAdmin(
                    po.getPoNumber(), po.getId(),
                    po.getCreatedBy() != null ? po.getCreatedBy().getId() : null);
        } else {
            po.setAdminStatus("Rejected");
            po.setOverallStatus("Cancelled");
            po.setAdminRemarks(adminRemarks);

            purchaseOrderRepository.save(po);
            addStatusHistory(po, "Rejected by Admin", admin, adminRemarks);

            // Notify pharmacist that PO was rejected
            notificationIntegrationService.notifyPORejectedByAdmin(
                    po.getPoNumber(), po.getId(),
                    po.getCreatedBy() != null ? po.getCreatedBy().getId() : null);
        }
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderListDto> listForSupplier(Integer supplierId) {
        if (supplierId == null) {
            return Collections.emptyList();
        }

        return purchaseOrderRepository.findAll().stream()
                .filter(po -> po.getSupplier() != null && po.getSupplier().getId().equals(supplierId))
                .filter(po -> {
                    String status = po.getOverallStatus();
                    return "Awaiting Receipt".equalsIgnoreCase(status)
                            || "Pending Supplier".equalsIgnoreCase(status)
                            || "Pending Admin".equalsIgnoreCase(status)
                            || status == null;
                })
                .sorted(Comparator.comparing(PurchaseOrder::getOrderDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toListDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderListDto> listForSupplierForPrincipal(Principal principal) {
        // Principal name is user email.
        User user = requireUser(principal);
        Supplier supplier = supplierRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found for user"));

        return listForSupplier(supplier.getId());
    }



    @Transactional
    @PreAuthorize("hasRole('Supplier')")
    public void supplierAcceptOrDecline(String poNumber, boolean accept, String supplierRemarks, Principal principal, Integer supplierIdOverride) {
        PurchaseOrder po = purchaseOrderRepository.findByPoNumber(poNumber)
                .orElseThrow(() -> new EntityNotFoundException("Purchase order not found"));

        ensureNotFinal(po);

        User supplierUser = requireUser(principal);

        // Authorize based on the supplier mapped to the logged-in user (principal name is email)
        Supplier loggedInSupplier = supplierRepository.findByEmail(supplierUser.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found for user"));

        Integer supplierId = supplierIdOverride != null ? supplierIdOverride : loggedInSupplier.getId();

        if (po.getSupplier() == null || supplierId == null || !po.getSupplier().getId().equals(supplierId)) {
            throw new SecurityException("Purchase order not assigned to this supplier");
        }

        if (accept) {
            po.setSupplierStatus("Accepted");
            po.setOverallStatus("Awaiting Receipt");
            po.setSupplierRemarks(supplierRemarks);
            purchaseOrderRepository.save(po);
            addStatusHistory(po, "Supplier Accepted", supplierUser, supplierRemarks);

            // Notify pharmacist that supplier accepted
            notificationIntegrationService.notifyPOAcceptedBySupplier(
                    po.getPoNumber(), po.getId(),
                    po.getCreatedBy() != null ? po.getCreatedBy().getId() : null);

            // Notify staff that there's inventory to receive
            notificationIntegrationService.notifyPOAwaitingReceipt(
                    po.getPoNumber(), po.getId());
        } else {
            po.setSupplierStatus("Declined");
            po.setOverallStatus("Cancelled");
            po.setSupplierRemarks(supplierRemarks);
            purchaseOrderRepository.save(po);
            addStatusHistory(po, "Supplier Declined", supplierUser, supplierRemarks);

            // Notify pharmacist that supplier declined
            notificationIntegrationService.notifyPODeclinedBySupplier(
                    po.getPoNumber(), po.getId(),
                    po.getCreatedBy() != null ? po.getCreatedBy().getId() : null);
        }
    }


    @Transactional(readOnly = true)
    public List<PurchaseOrderListDto> listAwaitingReceiptForStaff() {
        return purchaseOrderRepository.findAll().stream()
                .filter(po -> "Awaiting Receipt".equalsIgnoreCase(po.getOverallStatus()))
.sorted(Comparator.comparing(PurchaseOrder::getOrderDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toListDto)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasRole('Staff')")
    public void confirmReceipt(String poNumber, String goodsRemarks, Principal principal) {
        PurchaseOrder po = purchaseOrderRepository.findByPoNumber(poNumber)
                .orElseThrow(() -> new EntityNotFoundException("Purchase order not found"));

        ensureNotFinal(po);

        if (!"Awaiting Receipt".equalsIgnoreCase(po.getOverallStatus())) {
            throw new IllegalStateException("PO is not awaiting receipt");
        }

        User staff = requireUser(principal);

        // create goods receipt
        GoodsReceipt gr = new GoodsReceipt();
        gr.setPurchaseOrder(po);
        gr.setReceivedBy(staff);
        gr.setNotes(goodsRemarks);
        goodsReceiptRepository.save(gr);

        // update inventory & PO statuses
        for (PurchaseOrderItem it : po.getItems()) {
            Medicine m = it.getMedicine();
            if (m == null) continue;
            Integer qty = it.getQuantityOrdered();
            if (qty == null) qty = 0;
            m.setQuantity(m.getQuantity() + qty);
            medicineRepository.save(m);
        }

        po.setReceivingStatus("Received");
        po.setOverallStatus("Completed");

        purchaseOrderRepository.save(po);

        addStatusHistory(po, "Goods Received", staff, goodsRemarks);

        // Notify admin/pharmacist that goods were received
        notificationIntegrationService.notifyGoodsReceived(
                po.getPoNumber(), po.getId(), staff.getId());
    }

    private PurchaseOrderListDto toListDto(PurchaseOrder po) {
        PurchaseOrderListDto dto = new PurchaseOrderListDto();
        dto.setPoNumber(po.getPoNumber());
        dto.setSupplierId(po.getSupplier() == null ? null : po.getSupplier().getId());
        dto.setSupplierName(po.getSupplier() == null ? null : po.getSupplier().getName());
        dto.setPharmacistName(po.getCreatedBy() == null ? null : po.getCreatedBy().getName());
        dto.setOrderDate(po.getOrderDate());
        dto.setGrandTotal(po.getGrandTotal());
        dto.setOverallStatus(po.getOverallStatus());
        return dto;
    }

    public static class PurchaseOrderCreateRequest {
        private Integer supplierId;
        private LocalDate requiredDate;
        private String specialInstructions;
        private List<PurchaseOrderCreateItem> items;

        public Integer getSupplierId() {
            return supplierId;
        }

        public void setSupplierId(Integer supplierId) {
            this.supplierId = supplierId;
        }

        public LocalDate getRequiredDate() {
            return requiredDate;
        }

        public void setRequiredDate(LocalDate requiredDate) {
            this.requiredDate = requiredDate;
        }

        public String getSpecialInstructions() {
            return specialInstructions;
        }

        public void setSpecialInstructions(String specialInstructions) {
            this.specialInstructions = specialInstructions;
        }

        public List<PurchaseOrderCreateItem> getItems() {
            return items;
        }

        public void setItems(List<PurchaseOrderCreateItem> items) {
            this.items = items;
        }
    }

    public static class PurchaseOrderCreateItem {
        private Integer medicineId;
        private Integer quantity;
        private BigDecimal unitPrice;

        public Integer getMedicineId() {
            return medicineId;
        }

        public void setMedicineId(Integer medicineId) {
            this.medicineId = medicineId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }
    }
}

