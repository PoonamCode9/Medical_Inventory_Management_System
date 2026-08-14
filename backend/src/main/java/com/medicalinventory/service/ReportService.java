package com.medicalinventory.service;

public interface ReportService {

    byte[] generateMedicineInventoryReport();

    byte[] generateExpiryReport();

    byte[] generateStockReport();

    byte[] generateStockTransactionReport();

    byte[] generatePurchaseOrderReport();
}