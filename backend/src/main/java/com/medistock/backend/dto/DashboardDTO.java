package com.medistock.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {

    // Medicines
    private Long totalMedicines;

    // Suppliers
    private Long totalSuppliers;

    // Purchase Orders
    private Long totalPurchaseOrders;

    // Inventory
    private Long totalInventory;

    // Notifications
    private Long unreadNotifications;

    // Stock Status
    private Long lowStock;

    private Long outOfStock;

    // Expiry
    private Long expiringSoon;

    private Long expired;
}