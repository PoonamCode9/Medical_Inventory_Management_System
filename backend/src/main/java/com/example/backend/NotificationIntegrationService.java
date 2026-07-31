package com.example.backend;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service that integrates notification creation into existing workflows
 * such as task assignment, PO status changes, medicine alerts, etc.
 */
@Service
public class NotificationIntegrationService {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationIntegrationService(NotificationService notificationService,
                                           UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // ─── TASK NOTIFICATIONS ───────────────────────────────────

    @Transactional
    public void notifyTaskAssigned(Integer assignedToUserId, Integer createdByUserId,
                                    String taskTitle, Long taskId) {
        // Notify the staff member who was assigned
        notificationService.createNotification(
                assignedToUserId,
                "TASK",
                "New Task Assigned",
                "You have been assigned a new task: " + taskTitle,
                "TASK",
                taskId
        );

        // Notify the admin/pharmacist who created it (confirm assignment)
        if (createdByUserId != null && !createdByUserId.equals(assignedToUserId)) {
            notificationService.createNotification(
                    createdByUserId,
                    "TASK",
                    "Task Assigned",
                    "Task \"" + taskTitle + "\" has been assigned to staff",
                    "TASK",
                    taskId
            );
        }
    }

    @Transactional
    public void notifyTaskCompleted(Integer assignedToUserId, Integer createdByUserId,
                                     String taskTitle, Long taskId) {
        // Notify the creator (admin/pharmacist) that task is completed
        if (createdByUserId != null) {
            notificationService.createNotification(
                    createdByUserId,
                    "TASK",
                    "Task Completed",
                    "Task \"" + taskTitle + "\" has been completed by staff",
                    "TASK",
                    taskId
            );
        }
    }

    @Transactional
    public void notifyTaskOverdue(Integer assignedToUserId, Integer adminUserId,
                                   String taskTitle, Long taskId) {
        // Notify staff that task is overdue
        if (assignedToUserId != null) {
            notificationService.createNotification(
                    assignedToUserId,
                    "TASK",
                    "Task Overdue",
                    "Task \"" + taskTitle + "\" is overdue. Please complete it as soon as possible.",
                    "TASK",
                    taskId
            );
        }
        // Notify admin about overdue task
        if (adminUserId != null) {
            notificationService.createNotification(
                    adminUserId,
                    "TASK",
                    "Staff Task Overdue",
                    "Task \"" + taskTitle + "\" assigned to staff is overdue",
                    "TASK",
                    taskId
            );
        }
    }

    // ─── PURCHASE ORDER NOTIFICATIONS ─────────────────────────

    @Transactional
    public void notifyPOApprovedByAdmin(String poNumber, Long poId, Integer createdByUserId) {
        if (createdByUserId != null) {
            notificationService.createNotification(
                    createdByUserId,
                    "PO",
                    "Purchase Order Approved",
                    "PO " + poNumber + " has been approved by admin",
                    "PURCHASE_ORDER",
                    poId
            );
        }
    }

    @Transactional
    public void notifyPORejectedByAdmin(String poNumber, Long poId, Integer createdByUserId) {
        if (createdByUserId != null) {
            notificationService.createNotification(
                    createdByUserId,
                    "PO",
                    "Purchase Order Rejected",
                    "PO " + poNumber + " has been rejected by admin",
                    "PURCHASE_ORDER",
                    poId
            );
        }
    }

    @Transactional
    public void notifyPOAcceptedBySupplier(String poNumber, Long poId, Integer createdByUserId) {
        if (createdByUserId != null) {
            notificationService.createNotification(
                    createdByUserId,
                    "PO",
                    "Purchase Order Accepted by Supplier",
                    "PO " + poNumber + " has been accepted by supplier",
                    "PURCHASE_ORDER",
                    poId
            );
        }

        // Also notify all admins
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getId(),
                    "PO",
                    "PO Accepted by Supplier",
                    "PO " + poNumber + " has been accepted by supplier",
                    "PURCHASE_ORDER",
                    poId
            );
        }
    }

    @Transactional
    public void notifyPODeclinedBySupplier(String poNumber, Long poId, Integer createdByUserId) {
        if (createdByUserId != null) {
            notificationService.createNotification(
                    createdByUserId,
                    "PO",
                    "Purchase Order Declined by Supplier",
                    "PO " + poNumber + " has been declined by supplier",
                    "PURCHASE_ORDER",
                    poId
            );
        }

        // Also notify all admins
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getId(),
                    "PO",
                    "PO Declined by Supplier",
                    "PO " + poNumber + " has been declined by supplier",
                    "PURCHASE_ORDER",
                    poId
            );
        }
    }

    @Transactional
    public void notifyShipmentRejected(String poNumber, Long poId, Integer createdByUserId) {
        if (createdByUserId != null) {
            notificationService.createNotification(
                    createdByUserId,
                    "PO",
                    "Shipment Rejected",
                    "Shipment for PO " + poNumber + " has been rejected",
                    "PURCHASE_ORDER",
                    poId
            );
        }
    }

    @Transactional
    public void notifyPOAwaitingReceipt(String poNumber, Long poId) {
        // Notify all staff users about inventory to receive
        List<User> staffUsers = userRepository.findAll().stream()
                .filter(u -> "Staff".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User staff : staffUsers) {
            notificationService.createNotification(
                    staff.getId(),
                    "PO",
                    "Inventory to Receive",
                    "PO " + poNumber + " is awaiting receipt. Please receive the inventory.",
                    "PURCHASE_ORDER",
                    poId
            );
        }

        // Notify all admins about goods pending receipt
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getId(),
                    "PO",
                    "Goods Pending Receipt",
                    "PO " + poNumber + " is awaiting receipt from staff",
                    "PURCHASE_ORDER",
                    poId
            );
        }
    }

    @Transactional
    public void notifyGoodsReceived(String poNumber, Long poId, Integer receivedByUserId) {
        // Notify all admins
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getId(),
                    "PO",
                    "Goods Received",
                    "PO " + poNumber + " has been received into inventory",
                    "PURCHASE_ORDER",
                    poId
            );
        }
    }

    // ─── PURCHASE ORDER CREATED NOTIFICATION ─────────────────

    @Transactional
    public void notifyPOCreated(String poNumber, Long poId, Integer createdByUserId) {
        // Notify all admins about the new purchase order
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getId(),
                    "PO",
                    "New Purchase Order Created",
                    "A new purchase order " + poNumber + " has been created and is awaiting your approval",
                    "PURCHASE_ORDER",
                    poId
            );
        }
    }

    // ─── MEDICINE / INVENTORY NOTIFICATIONS ───────────────────

    @Transactional
    public void notifyLowStock(String medicineName, String batchNumber, int quantity,
                                Integer medicineId) {
        // Notify all pharmacists
        List<User> pharmacists = userRepository.findAll().stream()
                .filter(u -> "Pharmacist".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User pharmacist : pharmacists) {
            notificationService.createNotification(
                    pharmacist.getId(),
                    "LOW_STOCK",
                    "Low Stock Medicine",
                    medicineName + " (Batch: " + batchNumber + ") has only " + quantity + " units left",
                    "MEDICINE",
                    medicineId.longValue()
            );
        }

        // Also notify admin
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getId(),
                    "LOW_STOCK",
                    "Low Stock Alert",
                    medicineName + " (Batch: " + batchNumber + ") has only " + quantity + " units left",
                    "MEDICINE",
                    medicineId.longValue()
            );
        }
    }

    @Transactional
    public void notifyOutOfStock(String medicineName, String batchNumber, Integer medicineId) {
        List<User> pharmacists = userRepository.findAll().stream()
                .filter(u -> "Pharmacist".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User pharmacist : pharmacists) {
            notificationService.createNotification(
                    pharmacist.getId(),
                    "OUT_OF_STOCK",
                    "Out of Stock Medicine",
                    medicineName + " (Batch: " + batchNumber + ") is out of stock",
                    "MEDICINE",
                    medicineId.longValue()
            );
        }

        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getId(),
                    "OUT_OF_STOCK",
                    "Out of Stock Alert",
                    medicineName + " (Batch: " + batchNumber + ") is out of stock",
                    "MEDICINE",
                    medicineId.longValue()
            );
        }
    }

    @Transactional
    public void notifyExpiringMedicine(String medicineName, String batchNumber,
                                        int daysToExpiry, Integer medicineId) {
        List<User> pharmacists = userRepository.findAll().stream()
                .filter(u -> "Pharmacist".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User pharmacist : pharmacists) {
            notificationService.createNotification(
                    pharmacist.getId(),
                    "EXPIRING",
                    "Medicine Expiring Soon",
                    medicineName + " (Batch: " + batchNumber + ") expires in " + daysToExpiry + " days",
                    "MEDICINE",
                    medicineId.longValue()
            );
        }

        List<User> staffUsers = userRepository.findAll().stream()
                .filter(u -> "Staff".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User staff : staffUsers) {
            notificationService.createNotification(
                    staff.getId(),
                    "EXPIRING",
                    "Remove Expired Medicine",
                    medicineName + " (Batch: " + batchNumber + ") has expired. Please remove from inventory.",
                    "MEDICINE",
                    medicineId.longValue()
            );
        }

        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .toList();
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getId(),
                    "EXPIRING",
                    "Medicine Expiry Alert",
                    medicineName + " (Batch: " + batchNumber + ") expires in " + daysToExpiry + " days",
                    "MEDICINE",
                    medicineId.longValue()
            );
        }
    }
}

