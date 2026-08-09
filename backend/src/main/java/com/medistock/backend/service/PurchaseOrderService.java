
package com.medistock.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.PurchaseOrderRequest;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.SupplierRepository;
@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
        private final MedicineRepository medicineRepository;
        private final NotificationService notificationService;
    private final StockLogService stockLogService;
    private final InventoryRepository inventoryRepository;
    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;
    
public PurchaseOrderService(
        PurchaseOrderRepository purchaseOrderRepository,
        SupplierRepository supplierRepository,
        MedicineRepository medicineRepository,
        NotificationService notificationService,
        StockLogService stockLogService,
        InventoryRepository inventoryRepository,
        EmailService emailService,
        EmailTemplateService emailTemplateService) {

    this.purchaseOrderRepository = purchaseOrderRepository;
    this.supplierRepository = supplierRepository;
    this.medicineRepository = medicineRepository;
    this.notificationService = notificationService;
    this.stockLogService = stockLogService;
    this.inventoryRepository = inventoryRepository;
        this.emailService = emailService;
        this.emailTemplateService = emailTemplateService;
}
    // Get All
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    // Search
    public List<PurchaseOrder> searchPurchaseOrders(String keyword) {
        return purchaseOrderRepository.findByStatusContainingIgnoreCase(keyword);
    }

    // Create
   public PurchaseOrder createPurchaseOrder(PurchaseOrderRequest request) {

    Supplier supplier = supplierRepository.findById(request.getSupplierId())
            .orElseThrow(() -> new RuntimeException("Supplier not found"));

    Medicine medicine = medicineRepository.findById(request.getMedicineId())
            .orElseThrow(() -> new RuntimeException("Medicine not found"));

    PurchaseOrder order = new PurchaseOrder();

    order.setSupplier(supplier);
    order.setMedicine(medicine);
    order.setQuantity(request.getQuantity());
    order.setPurchaseDate(request.getPurchaseDate());
    order.setStatus(request.getStatus());

    PurchaseOrder savedOrder = purchaseOrderRepository.save(order);
String body = """
<p>Hello <b>%s</b>,</p>

<p>
A new purchase order has been created for your company.
</p>

<table style="width:100%%;border-collapse:collapse;">

<tr>
<td><b>Medicine</b></td>
<td>%s</td>
</tr>

<tr>
<td><b>Quantity</b></td>
<td>%d Units</td>
</tr>

<tr>
<td><b>Purchase Date</b></td>
<td>%s</td>
</tr>

<tr>
<td><b>Status</b></td>
<td>%s</td>
</tr>

</table>

<br>

<p>
Kindly process this order as soon as possible.
</p>

<p>
Thank you for your partnership.
</p>

<p>

Regards,<br>

<b>MediStock Pharmacy</b>

</p>
"""
.formatted(

savedOrder.getSupplier().getSupplierName(),

savedOrder.getMedicine().getMedicineName(),

savedOrder.getQuantity(),

savedOrder.getPurchaseDate(),

savedOrder.getStatus()

);

emailService.sendEmail(

savedOrder.getSupplier().getEmail(),

"📦 New Purchase Order",

emailTemplateService.buildTemplate(

"Purchase Order Created",

body

)

);
    notificationService.createNotification(
            1,
            "Purchase Order created for "
                    + savedOrder.getMedicine().getMedicineName()
                    + " (" + savedOrder.getQuantity() + " units).",
            "PURCHASE_ORDER"
    );
com.medistock.backend.entity.Inventory inventory =
        inventoryRepository.findByMedicine_MedicineId(
                savedOrder.getMedicine().getMedicineId())
        .orElseThrow(() -> new RuntimeException("Inventory not found"));

stockLogService.createLog(
        inventory.getInventoryId(),
        "PURCHASE_CREATE",
        savedOrder.getQuantity(),
        savedOrder.getPurchaseId()
);

try {

    emailService.sendEmail(
            supplier.getEmail(),
            "New Purchase Order - MediStock",
            """
            Dear %s,

            A new purchase order has been created.

            ============================
            Purchase Order Details
            ============================

            Order ID : %d

            Medicine : %s

            Quantity : %d

            Order Date : %s

            Status : %s

            Please process this order at the earliest.

            Regards,

            MediStock Team
            """
            .formatted(
                    supplier.getSupplierName(),
                    savedOrder.getPurchaseId(),
                    medicine.getMedicineName(),
                    savedOrder.getQuantity(),
                    savedOrder.getPurchaseDate(),
                    savedOrder.getStatus()
            )
    );

} catch (Exception e) {

    System.out.println("Email could not be sent.");
    e.printStackTrace();

}

    return savedOrder;
}
    // Update
   public PurchaseOrder updatePurchaseOrder(Integer id, PurchaseOrderRequest request) {

    PurchaseOrder order = purchaseOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Purchase Order not found"));

    Supplier supplier = supplierRepository.findById(request.getSupplierId())
            .orElseThrow(() -> new RuntimeException("Supplier not found"));

    Medicine medicine = medicineRepository.findById(request.getMedicineId())
            .orElseThrow(() -> new RuntimeException("Medicine not found"));

    order.setSupplier(supplier);
    order.setMedicine(medicine);
    order.setQuantity(request.getQuantity());
    order.setPurchaseDate(request.getPurchaseDate());
    order.setStatus(request.getStatus());

    PurchaseOrder updatedOrder = purchaseOrderRepository.save(order);

    notificationService.createNotification(
            1,
            "Purchase Order updated for "
                    + updatedOrder.getMedicine().getMedicineName()
                    + ". Status: "
                    + updatedOrder.getStatus(),
            "PURCHASE_ORDER"
    );
com.medistock.backend.entity.Inventory inventory =
        inventoryRepository.findByMedicine_MedicineId(
                updatedOrder.getMedicine().getMedicineId())
        .orElseThrow(() -> new RuntimeException("Inventory not found"));

stockLogService.createLog(
        inventory.getInventoryId(),
        "PURCHASE_UPDATE",
        updatedOrder.getQuantity(),
        updatedOrder.getPurchaseId()
);

    return updatedOrder;
}
    // Delete
  public void deletePurchaseOrder(Integer id) {

    PurchaseOrder order = purchaseOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Purchase Order not found"));

    notificationService.createNotification(
            1,
            "Purchase Order deleted for "
                    + order.getMedicine().getMedicineName(),
            "PURCHASE_ORDER"
    );
com.medistock.backend.entity.Inventory inventory =
        inventoryRepository.findByMedicine_MedicineId(
                order.getMedicine().getMedicineId())
        .orElseThrow(() -> new RuntimeException("Inventory not found"));

stockLogService.createLog(
        inventory.getInventoryId(),
        "PURCHASE_DELETE",
        order.getQuantity(),
        order.getPurchaseId()
);

    purchaseOrderRepository.deleteById(id);
}
}