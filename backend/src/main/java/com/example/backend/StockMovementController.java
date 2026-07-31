package com.example.backend;

import com.example.backend.dto.StockMovementRowDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class StockMovementController {

    private final DispenseItemRepository dispenseItemRepository;
    private final GoodsReceiptRepository goodsReceiptRepository;
    private final MedicineRepository medicineRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;

    public StockMovementController(
            DispenseItemRepository dispenseItemRepository,
            GoodsReceiptRepository goodsReceiptRepository,
            MedicineRepository medicineRepository,
            PurchaseOrderItemRepository purchaseOrderItemRepository
    ) {
        this.dispenseItemRepository = dispenseItemRepository;
        this.goodsReceiptRepository = goodsReceiptRepository;
        this.medicineRepository = medicineRepository;
        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
    }

    @GetMapping("/stock-movements")
    public ResponseEntity<List<StockMovementRowDto>> getStockMovements() {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        List<StockMovementRowDto> movements = new ArrayList<>();
        long seqId = 0L;

        // ─── 1. OUT movements from dispenses ───────────────────────
        List<DispenseItem> dispenseItems = dispenseItemRepository.findAll();
        for (DispenseItem di : dispenseItems) {
            StockMovementRowDto dto = new StockMovementRowDto();
            dto.setId(++seqId);
            if (di.getDispense() != null && di.getDispense().getCreatedAt() != null) {
                dto.setDate(di.getDispense().getCreatedAt().format(fmt));
            }
            if (di.getMedicine() != null) {
                dto.setMedicineName(di.getMedicine().getName());
                dto.setBatchNumber(di.getMedicine().getBatchNumber());
            }
            dto.setType("OUT");
            dto.setQuantity(di.getQuantity());
            if (di.getDispense() != null) {
                dto.setReference("Dispense #" + di.getDispense().getId());
                if (di.getDispense().getDispensedBy() != null) {
                    dto.setPerformedBy(di.getDispense().getDispensedBy().getName());
                }
                dto.setRemarks(di.getDispense().getRemarks());
            }
            movements.add(dto);
        }

        // ─── 2. IN movements from goods receipts (PO receiving) ────
        List<GoodsReceipt> goodsReceipts = goodsReceiptRepository.findAll();
        for (GoodsReceipt gr : goodsReceipts) {
            if (gr.getPurchaseOrder() == null) continue;

            String poNumber = gr.getPurchaseOrder().getPoNumber();

            // Each item in the purchase order is a separate movement entry
            if (gr.getPurchaseOrder().getItems() != null) {
                for (PurchaseOrderItem poi : gr.getPurchaseOrder().getItems()) {
                    StockMovementRowDto dto = new StockMovementRowDto();
                    dto.setId(++seqId);
                    if (gr.getReceivedDate() != null) {
                        dto.setDate(gr.getReceivedDate().format(fmt));
                    } else if (gr.getCreatedAt() != null) {
                        dto.setDate(gr.getCreatedAt().format(fmt));
                    }
                    if (poi.getMedicine() != null) {
                        dto.setMedicineName(poi.getMedicine().getName());
                        dto.setBatchNumber(poi.getMedicine().getBatchNumber());
                    }
                    dto.setType("IN");
                    dto.setQuantity(poi.getQuantityOrdered());
                    dto.setReference("PO " + poNumber);
                    if (gr.getReceivedBy() != null) {
                        dto.setPerformedBy(gr.getReceivedBy().getName());
                    }
                    dto.setRemarks(gr.getNotes());
                    movements.add(dto);
                }
            }
        }

        // ─── 3. IN movements from manual medicine additions ───────
        // We treat newly created medicines as manual stock additions.
        // Since we don't have a dedicated "created_at" on Medicine or a log,
        // we infer IN movements from medicines that exist. We'll flag the batch
        // as "Manual Addition" when the quantity was set initially.
        // To avoid duplicates with PO-received medicines, we skip medicines
        // that are referenced in any purchase order items.
        List<Medicine> allMedicines = medicineRepository.findAll();
        for (Medicine med : allMedicines) {
            // Check if this medicine appears in any purchase order item - if so, skip
            // (stock came in via PO, already recorded above)
            boolean appearsInPO = false;
            for (GoodsReceipt gr : goodsReceipts) {
                if (gr.getPurchaseOrder() != null && gr.getPurchaseOrder().getItems() != null) {
                    for (PurchaseOrderItem poi : gr.getPurchaseOrder().getItems()) {
                        if (poi.getMedicine() != null && poi.getMedicine().getId().equals(med.getId())) {
                            appearsInPO = true;
                            break;
                        }
                    }
                }
                if (appearsInPO) break;
            }

            // Also check if this medicine appears in dispense items (already recorded as OUT)
            // We still want to show it as IN if it has stock, but skip if already fully tracked via PO
            if (appearsInPO) continue;

            // Treat as manual addition if quantity > 0
            if (med.getQuantity() != null && med.getQuantity() > 0) {
                StockMovementRowDto dto = new StockMovementRowDto();
                dto.setId(++seqId);
                // Use a fixed placeholder date since we don't track creation time on Medicine
                // We'll use the expiry date as a heuristic or just mark as "N/A"
                dto.setDate("N/A");
                dto.setMedicineName(med.getName());
                dto.setBatchNumber(med.getBatchNumber());
                dto.setType("IN");
                dto.setQuantity(med.getQuantity());
                dto.setReference("Manual Addition");
                dto.setPerformedBy("Admin");
                dto.setRemarks("Initial stock / manual adjustment");
                movements.add(dto);
            }
        }

        // ─── Sort: newest first ────────────────────────────────────
        movements.sort(Comparator.comparing(StockMovementRowDto::getDate,
                Comparator.nullsLast(Comparator.naturalOrder())).reversed());

        return ResponseEntity.ok(movements);
    }
}

