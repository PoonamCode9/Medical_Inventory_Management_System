package com.medistock.backend.service.impl;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.lowagie.text.DocumentException;
import com.medistock.backend.dto.ReportDTO;
import com.medistock.backend.dto.ReportRequest;
import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.entity.Report;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.entity.User;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.ReportRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.ReportService;
import com.medistock.backend.util.PdfGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    private final UserRepository userRepository;

    private final InventoryRepository inventoryRepository;

    private final SupplierRepository supplierRepository;

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final MedicineRepository medicineRepository;

    private final PdfGenerator pdfGenerator;

    @Override
    public List<ReportDTO> getAllReports() {

        return reportRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ===========================================================
    // CREATE REPORT HISTORY
    // ===========================================================

    @Override
    public ReportDTO createReport(ReportRequest request) {

        User user = userRepository.findById(request.getGeneratedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = new Report();

        report.setGeneratedBy(user);
        report.setReportType(request.getReportType());
        report.setGeneratedAt(LocalDateTime.now());

        Report saved = reportRepository.save(report);

        return convertToDTO(saved);
    }

    // ===========================================================
    // DELETE REPORT HISTORY
    // ===========================================================

    @Override
    public void deleteReport(Integer id) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        reportRepository.delete(report);
    }

    // ===========================================================
    // INVENTORY REPORT PDF
    // ===========================================================

    @Override
    public ByteArrayOutputStream generateInventoryReport(Integer userId) {

        try {

            List<Inventory> inventories = inventoryRepository.findAll();

            saveReport(userId, "Inventory Report");

            return pdfGenerator.generateInventoryReport(inventories);

        } catch (DocumentException e) {

            throw new RuntimeException("Error generating Inventory Report", e);

        }
    }

    // ===========================================================
    // SUPPLIER REPORT PDF
    // ===========================================================

    @Override
    public ByteArrayOutputStream generateSupplierReport(Integer userId) {

        try {

            List<Supplier> suppliers = supplierRepository.findAll();

            saveReport(userId, "Supplier Report");

            return pdfGenerator.generateSupplierReport(suppliers);

        } catch (DocumentException e) {

            throw new RuntimeException("Error generating Supplier Report", e);

        }
    }

    // ===========================================================
    // PURCHASE REPORT PDF
    // ===========================================================

    @Override
    public ByteArrayOutputStream generatePurchaseReport(Integer userId) {

        try {

            List<PurchaseOrder> orders = purchaseOrderRepository.findAll();

            saveReport(userId, "Purchase Report");

            return pdfGenerator.generatePurchaseReport(orders);

        } catch (DocumentException e) {

            throw new RuntimeException("Error generating Purchase Report", e);

        }
    }

    // ===========================================================
    // LOW STOCK REPORT PDF
    // ===========================================================

    @Override
    public ByteArrayOutputStream generateLowStockReport(Integer userId) {

        try {

            List<Medicine> medicines = medicineRepository.findAll();

            saveReport(userId, "Low Stock Report");

            return pdfGenerator.generateLowStockReport(medicines);

        } catch (DocumentException e) {

            throw new RuntimeException("Error generating Low Stock Report", e);

        }
    }

    // ===========================================================
    // SAVE REPORT HISTORY
    // ===========================================================

    private void saveReport(Integer userId, String reportType) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = new Report();

        report.setGeneratedBy(user);
        report.setReportType(reportType);
        report.setGeneratedAt(LocalDateTime.now());

        reportRepository.save(report);
    }

    // ===========================================================
    // ENTITY -> DTO
    // ===========================================================

    private ReportDTO convertToDTO(Report report) {

        ReportDTO dto = new ReportDTO();

        dto.setReportId(report.getReportId());

        dto.setGeneratedBy(report.getGeneratedBy().getUserId());

        dto.setGeneratedByName(report.getGeneratedBy().getFullName());

        dto.setReportType(report.getReportType());

        dto.setGeneratedAt(report.getGeneratedAt());

        return dto;
    }
}