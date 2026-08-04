package com.medistock.service;

import java.util.List;
import java.util.Map;
import com.medistock.dto.ReportResponse;
import com.medistock.entity.ExpiryTracking;
import com.medistock.entity.Medicine;
import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.Report;

import com.medistock.entity.Supplier;

public interface ReportService {

    Report addReport(Report report);

    List<Report> getAllReports();

    Report getReportById(Long id);

    Report updateReport(Long id, Report report);

    void deleteReport(Long id);

    Map<String, Long> getDashboardAnalytics();

List<Medicine> getInventoryReport();

List<Medicine> getLowStockReport();

List<ExpiryTracking> getExpiryReport();

List<Supplier> getSupplierReport();

List<PurchaseOrder> getPurchaseOrderReport();
ReportResponse generateReport();

}
