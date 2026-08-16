package com.MediStock.app.dto;

import java.util.List;

public class DashboardResponse {

    /*
     |--------------------------------------------------------------------------
     | Summary
     |--------------------------------------------------------------------------
     */

    private DashboardSummaryResponse summary;


    /*
     |--------------------------------------------------------------------------
     | Analytics Summaries
     |--------------------------------------------------------------------------
     */

    private MedicineAnalyticsResponse medicines;

    private InventoryAnalyticsResponse inventory;

    private SupplierAnalyticsResponse suppliers;

    private PurchaseAnalyticsResponse purchaseOrders;

    private NotificationAnalyticsResponse notifications;

    private UserAnalyticsResponse users;

    private SalesAnalyticsResponse sales;


    /*
     |--------------------------------------------------------------------------
     | Detailed Database Records
     |--------------------------------------------------------------------------
     */

    private List<MedicineResponse> medicineRecords;

    private List<InventoryResponse> inventoryRecords;

    private List<SupplierResponse> supplierRecords;

    private List<PurchaseOrderResponse> purchaseOrderRecords;

    private List<NotificationResponse> notificationRecords;

    private List<UserResponse> userRecords;

    private List<SaleResponse> salesRecords;


    /*
     |--------------------------------------------------------------------------
     | Activity / Audit Records
     |--------------------------------------------------------------------------
     */

    private List<ActivityLogResponse> activityLogs;


    /*
     |--------------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------------
     */

    public DashboardResponse() {
    }


    /*
     |--------------------------------------------------------------------------
     | Summary Getters / Setters
     |--------------------------------------------------------------------------
     */

    public DashboardSummaryResponse getSummary() {

        return summary;

    }

    public void setSummary(
            DashboardSummaryResponse summary
    ) {

        this.summary = summary;

    }


    /*
     |--------------------------------------------------------------------------
     | Medicine Analytics
     |--------------------------------------------------------------------------
     */

    public MedicineAnalyticsResponse getMedicines() {

        return medicines;

    }

    public void setMedicines(
            MedicineAnalyticsResponse medicines
    ) {

        this.medicines = medicines;

    }


    /*
     |--------------------------------------------------------------------------
     | Inventory Analytics
     |--------------------------------------------------------------------------
     */

    public InventoryAnalyticsResponse getInventory() {

        return inventory;

    }

    public void setInventory(
            InventoryAnalyticsResponse inventory
    ) {

        this.inventory = inventory;

    }


    /*
     |--------------------------------------------------------------------------
     | Supplier Analytics
     |--------------------------------------------------------------------------
     */

    public SupplierAnalyticsResponse getSuppliers() {

        return suppliers;

    }

    public void setSuppliers(
            SupplierAnalyticsResponse suppliers
    ) {

        this.suppliers = suppliers;

    }


    /*
     |--------------------------------------------------------------------------
     | Purchase Order Analytics
     |--------------------------------------------------------------------------
     */

    public PurchaseAnalyticsResponse getPurchaseOrders() {

        return purchaseOrders;

    }

    public void setPurchaseOrders(
            PurchaseAnalyticsResponse purchaseOrders
    ) {

        this.purchaseOrders = purchaseOrders;

    }


    /*
     |--------------------------------------------------------------------------
     | Notification Analytics
     |--------------------------------------------------------------------------
     */

    public NotificationAnalyticsResponse getNotifications() {

        return notifications;

    }

    public void setNotifications(
            NotificationAnalyticsResponse notifications
    ) {

        this.notifications = notifications;

    }


    /*
     |--------------------------------------------------------------------------
     | User Analytics
     |--------------------------------------------------------------------------
     */

    public UserAnalyticsResponse getUsers() {

        return users;

    }

    public void setUsers(
            UserAnalyticsResponse users
    ) {

        this.users = users;

    }


    /*
     |--------------------------------------------------------------------------
     | Sales Analytics
     |--------------------------------------------------------------------------
     */

    public SalesAnalyticsResponse getSales() {

        return sales;

    }

    public void setSales(
            SalesAnalyticsResponse sales
    ) {

        this.sales = sales;

    }


    /*
     |--------------------------------------------------------------------------
     | Detailed Medicine Records
     |--------------------------------------------------------------------------
     */

    public List<MedicineResponse> getMedicineRecords() {

        return medicineRecords;

    }

    public void setMedicineRecords(
            List<MedicineResponse> medicineRecords
    ) {

        this.medicineRecords = medicineRecords;

    }


    /*
     |--------------------------------------------------------------------------
     | Detailed Inventory Records
     |--------------------------------------------------------------------------
     */

    public List<InventoryResponse> getInventoryRecords() {

        return inventoryRecords;

    }

    public void setInventoryRecords(
            List<InventoryResponse> inventoryRecords
    ) {

        this.inventoryRecords = inventoryRecords;

    }


    /*
     |--------------------------------------------------------------------------
     | Detailed Supplier Records
     |--------------------------------------------------------------------------
     */

    public List<SupplierResponse> getSupplierRecords() {

        return supplierRecords;

    }

    public void setSupplierRecords(
            List<SupplierResponse> supplierRecords
    ) {

        this.supplierRecords = supplierRecords;

    }


    /*
     |--------------------------------------------------------------------------
     | Detailed Purchase Order Records
     |--------------------------------------------------------------------------
     */

    public List<PurchaseOrderResponse> getPurchaseOrderRecords() {

        return purchaseOrderRecords;

    }

    public void setPurchaseOrderRecords(
            List<PurchaseOrderResponse> purchaseOrderRecords
    ) {

        this.purchaseOrderRecords = purchaseOrderRecords;

    }


    /*
     |--------------------------------------------------------------------------
     | Detailed Notification Records
     |--------------------------------------------------------------------------
     */

    public List<NotificationResponse> getNotificationRecords() {

        return notificationRecords;

    }

    public void setNotificationRecords(
            List<NotificationResponse> notificationRecords
    ) {

        this.notificationRecords = notificationRecords;

    }


    /*
     |--------------------------------------------------------------------------
     | Detailed User Records
     |--------------------------------------------------------------------------
     */

    public List<UserResponse> getUserRecords() {

        return userRecords;

    }

    public void setUserRecords(
            List<UserResponse> userRecords
    ) {

        this.userRecords = userRecords;

    }


    /*
     |--------------------------------------------------------------------------
     | Detailed Sales Records
     |--------------------------------------------------------------------------
     */

    public List<SaleResponse> getSalesRecords() {

        return salesRecords;

    }

    public void setSalesRecords(
            List<SaleResponse> salesRecords
    ) {

        this.salesRecords = salesRecords;

    }


    /*
     |--------------------------------------------------------------------------
     | Activity / Audit Logs
     |--------------------------------------------------------------------------
     */

    public List<ActivityLogResponse> getActivityLogs() {

        return activityLogs;

    }

    public void setActivityLogs(
            List<ActivityLogResponse> activityLogs
    ) {

        this.activityLogs = activityLogs;

    }

}