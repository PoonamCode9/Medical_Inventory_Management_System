package com.medistock.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.medistock.entity.Report;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.NotificationRepository;
import com.medistock.repository.ReportRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.service.ReportService;

import java.util.stream.Collectors;

import com.medistock.entity.Medicine;
import com.medistock.entity.Supplier;
import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.ExpiryTracking;

import com.medistock.repository.PurchaseOrderRepository;
import com.medistock.repository.ExpiryTrackingRepository;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final NotificationRepository notificationRepository;

    private final PurchaseOrderRepository purchaseOrderRepository;

private final ExpiryTrackingRepository expiryTrackingRepository;

    public ReportServiceImpl(
        ReportRepository reportRepository,
        MedicineRepository medicineRepository,
        SupplierRepository supplierRepository,
        NotificationRepository notificationRepository,
        PurchaseOrderRepository purchaseOrderRepository,
        ExpiryTrackingRepository expiryTrackingRepository) {

    this.reportRepository = reportRepository;
    this.medicineRepository = medicineRepository;
    this.supplierRepository = supplierRepository;
    this.notificationRepository = notificationRepository;
    this.purchaseOrderRepository = purchaseOrderRepository;
    this.expiryTrackingRepository = expiryTrackingRepository;
}

    @Override
    public Report addReport(Report report) {
        return reportRepository.save(report);
    }

    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public Report getReportById(Long id) {
        return reportRepository.findById(id).orElse(null);
    }

    @Override
    public Report updateReport(Long id, Report report) {

        Report existing = reportRepository.findById(id).orElse(null);

        if (existing != null) {

            existing.setReportName(report.getReportName());
            existing.setReportType(report.getReportType());
            existing.setGeneratedDate(report.getGeneratedDate());

            return reportRepository.save(existing);
        }

        return null;
    }

    @Override
    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }

    @Override
    public Map<String, Long> getDashboardAnalytics() {

        Map<String, Long> analytics = new HashMap<>();

        analytics.put("totalMedicines", medicineRepository.count());

        analytics.put("suppliers", supplierRepository.count());

        analytics.put("notifications", notificationRepository.count());

        analytics.put(
                "reports",
                reportRepository.count()
        );

        return analytics;
    }

@Override
public List<Medicine> getInventoryReport() {
    return medicineRepository.findAll();
}

@Override
public List<Medicine> getLowStockReport() {

    return medicineRepository.findAll()
            .stream()
            .filter(m -> m.getQuantity() <= 20)
            .collect(Collectors.toList());

}

@Override
public List<ExpiryTracking> getExpiryReport() {
    return expiryTrackingRepository.findAll();
}

@Override
public List<Supplier> getSupplierReport() {
    return supplierRepository.findAll();
}

@Override
public List<PurchaseOrder> getPurchaseOrderReport() {
    return purchaseOrderRepository.findAll();
}
}