package com.medicalinventory.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.medicalinventory.entity.User;
import com.medicalinventory.entity.Medicine;
import com.medicalinventory.entity.Report;
import com.medicalinventory.entity.StockLog;
import com.medicalinventory.entity.PurchaseOrder;
import com.medicalinventory.entity.PurchaseOrderItem;
import com.medicalinventory.repository.MedicineRepository;

import com.medicalinventory.repository.ReportRepository;
import com.medicalinventory.repository.StockLogRepository;
import com.medicalinventory.repository.UserRepository;
import com.medicalinventory.repository.PurchaseOrderRepository;

import com.medicalinventory.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final MedicineRepository medicineRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final StockLogRepository stockLogRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public ReportServiceImpl(
            MedicineRepository medicineRepository,
            ReportRepository reportRepository,
            UserRepository userRepository,
            StockLogRepository stockLogRepository,
            PurchaseOrderRepository purchaseOrderRepository) {

        this.medicineRepository = medicineRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.stockLogRepository = stockLogRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Override
    public byte[] generateMedicineInventoryReport() {

        try {

            List<Medicine> medicines = medicineRepository.findAllByOrderByMedicineNameAsc();

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4.rotate());

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font subTitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

            Paragraph title = new Paragraph(
                    "Medical Inventory Management System",
                    titleFont);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            Paragraph reportTitle = new Paragraph(
                    "Medicine Inventory Report",
                    subTitleFont);

            reportTitle.setAlignment(Element.ALIGN_CENTER);

            document.add(reportTitle);

            document.add(new Paragraph(" "));

            Paragraph generatedOn = new Paragraph(
                    "Generated On : " + LocalDateTime.now());

            generatedOn.setAlignment(Element.ALIGN_RIGHT);

            document.add(generatedOn);

            document.add(new Paragraph(" "));

            // Table will be added here in the next step
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(15);

            table.setWidths(new float[] { 3f, 2f, 2f, 1.5f, 2f, 2f });

            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            PdfPCell cell;

            cell = new PdfPCell(new Phrase("Medicine", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Category", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Batch No", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Quantity", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Expiry Date", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Unit Price", headerFont));
            table.addCell(cell);

            for (Medicine medicine : medicines) {

                table.addCell(medicine.getMedicineName());
                table.addCell(medicine.getCategory());
                table.addCell(medicine.getBatchNo());
                table.addCell(String.valueOf(medicine.getQuantity()));
                table.addCell(String.valueOf(medicine.getExpiryDate()));
                table.addCell(String.valueOf(medicine.getUnitPrice()));
            }

            document.add(table);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Report report = new Report();

            report.setReportName("Medicine Inventory Report");
            report.setGeneratedBy(user);
            report.setGeneratedOn(LocalDateTime.now());

            reportRepository.save(report);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Failed to generate Medicine Inventory Report", e);

        }
    }

    @Override
    public byte[] generateExpiryReport() {

        try {

            List<Medicine> medicines = medicineRepository.findAll();

            LocalDate today = LocalDate.now();

            List<Medicine> expiryMedicines = medicines.stream()
                    .filter(medicine -> medicine.getExpiryDate() != null)
                    .filter(medicine -> medicine.getExpiryDate().isBefore(today.plusMonths(3)))
                    .collect(Collectors.toList());

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4.rotate());

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font subTitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

            Paragraph title = new Paragraph(
                    "Medical Inventory Management System",
                    titleFont);

            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph reportTitle = new Paragraph(
                    "Medicine Expiry Report",
                    subTitleFont);

            reportTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(reportTitle);

            document.add(new Paragraph(" "));

            Paragraph generatedOn = new Paragraph(
                    "Generated On : " + LocalDateTime.now());

            generatedOn.setAlignment(Element.ALIGN_RIGHT);
            document.add(generatedOn);

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);

            table.setWidthPercentage(100);

            table.setWidths(new float[] { 3f, 2f, 2f, 2f, 2f });

            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            table.addCell(new Phrase("Medicine", headerFont));
            table.addCell(new Phrase("Category", headerFont));
            table.addCell(new Phrase("Batch No", headerFont));
            table.addCell(new Phrase("Expiry Date", headerFont));
            table.addCell(new Phrase("Status", headerFont));

            for (Medicine medicine : expiryMedicines) {

                table.addCell(medicine.getMedicineName());
                table.addCell(medicine.getCategory());
                table.addCell(medicine.getBatchNo());
                table.addCell(String.valueOf(medicine.getExpiryDate()));

                if (medicine.getExpiryDate().isBefore(today)) {
                    table.addCell("Expired");
                } else {
                    table.addCell("Expiring Soon");
                }
            }

            document.add(table);

            Authentication authentication = SecurityContextHolder
                    .getContext()
                    .getAuthentication();

            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Report report = new Report();

            report.setReportName("Medicine Expiry Report");
            report.setGeneratedBy(user);
            report.setGeneratedOn(LocalDateTime.now());

            reportRepository.save(report);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Failed to generate Expiry Report", e);

        }
    }

    @Override
    public byte[] generateStockReport() {

        try {

            List<Medicine> medicines = medicineRepository.findAllByOrderByMedicineNameAsc();

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4.rotate());

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font subTitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

            Paragraph title = new Paragraph(
                    "Medical Inventory Management System",
                    titleFont);

            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph reportTitle = new Paragraph(
                    "Stock Report",
                    subTitleFont);

            reportTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(reportTitle);

            document.add(new Paragraph(" "));

            Paragraph generatedOn = new Paragraph(
                    "Generated On : " + LocalDateTime.now());

            generatedOn.setAlignment(Element.ALIGN_RIGHT);
            document.add(generatedOn);

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);

            table.setWidthPercentage(100);

            table.setWidths(new float[] { 3f, 2f, 2f, 2f, 2f });

            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            table.addCell(new Phrase("Medicine", headerFont));
            table.addCell(new Phrase("Category", headerFont));
            table.addCell(new Phrase("Batch No", headerFont));
            table.addCell(new Phrase("Quantity", headerFont));
            table.addCell(new Phrase("Status", headerFont));

            for (Medicine medicine : medicines) {

                table.addCell(medicine.getMedicineName());
                table.addCell(medicine.getCategory());
                table.addCell(medicine.getBatchNo());
                table.addCell(String.valueOf(medicine.getQuantity()));

                if (medicine.getQuantity() == 0) {
                    table.addCell("Out of Stock");
                } else if (medicine.getQuantity() <= 50) {
                    table.addCell("Low Stock");
                } else {
                    table.addCell("Available");
                }
            }

            document.add(table);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Report report = new Report();

            report.setReportName("Stock Report");
            report.setGeneratedBy(user);
            report.setGeneratedOn(LocalDateTime.now());

            reportRepository.save(report);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Failed to generate Stock Report", e);
        }
    }

    @Override
    public byte[] generateStockTransactionReport() {

        try {

            List<StockLog> stockLogs = stockLogRepository.findAll();

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4.rotate());

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font subTitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

            Paragraph title = new Paragraph(
                    "Medical Inventory Management System",
                    titleFont);

            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph reportTitle = new Paragraph(
                    "Stock Transaction Report",
                    subTitleFont);

            reportTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(reportTitle);

            document.add(new Paragraph(" "));

            Paragraph generatedOn = new Paragraph(
                    "Generated On : " + LocalDateTime.now());

            generatedOn.setAlignment(Element.ALIGN_RIGHT);
            document.add(generatedOn);

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(8);

            table.setWidthPercentage(100);

            table.setWidths(new float[] {
                    3f, 2f, 1.5f, 1.5f, 1.5f, 2f, 3f, 3f
            });

            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            table.addCell(new Phrase("Medicine", headerFont));
            table.addCell(new Phrase("Action", headerFont));
            table.addCell(new Phrase("Quantity", headerFont));
            table.addCell(new Phrase("Old Qty", headerFont));
            table.addCell(new Phrase("New Qty", headerFont));
            table.addCell(new Phrase("User", headerFont));
            table.addCell(new Phrase("Role", headerFont));
            table.addCell(new Phrase("Date", headerFont));

            for (StockLog log : stockLogs) {

                table.addCell(log.getMedicine().getMedicineName());

                table.addCell(log.getAction());

                table.addCell(String.valueOf(log.getQuantity()));

                table.addCell(String.valueOf(log.getOldQuantity()));

                table.addCell(String.valueOf(log.getNewQuantity()));

                table.addCell(log.getUser().getUsername());
                table.addCell(log.getUser().getRole().getName());

                table.addCell(String.valueOf(log.getActionDate()));
            }

            document.add(table);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Report report = new Report();

            report.setReportName("Stock Transaction Report");
            report.setGeneratedBy(user);
            report.setGeneratedOn(LocalDateTime.now());

            reportRepository.save(report);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Failed to generate Stock Transaction Report", e);
        }
    }

    @Override
    public byte[] generatePurchaseOrderReport() {

        try {

            List<PurchaseOrder> orders = purchaseOrderRepository.findAll();

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4.rotate());

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font subTitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

            Paragraph title = new Paragraph(
                    "Medical Inventory Management System",
                    titleFont);

            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph reportTitle = new Paragraph(
                    "Purchase Order Report",
                    subTitleFont);

            reportTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(reportTitle);

            document.add(new Paragraph(" "));

            Paragraph generatedOn = new Paragraph(
                    "Generated On : " + LocalDateTime.now());

            generatedOn.setAlignment(Element.ALIGN_RIGHT);
            document.add(generatedOn);

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(8);

            table.setWidthPercentage(100);

            table.setWidths(new float[] {
                    1.5f, 2.5f, 3f, 1.5f,
                    2f, 2f, 1.5f, 2f
            });

            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            table.addCell(new Phrase("Order ID", headerFont));
            table.addCell(new Phrase("Supplier", headerFont));
            table.addCell(new Phrase("Medicine", headerFont));
            table.addCell(new Phrase("Quantity", headerFont));
            table.addCell(new Phrase("Order Date", headerFont));
            table.addCell(new Phrase("Expected Delivery", headerFont));
            table.addCell(new Phrase("Status", headerFont));
            table.addCell(new Phrase("Total Amount", headerFont));

            for (PurchaseOrder order : orders) {

                for (PurchaseOrderItem item : order.getItems()) {

                    table.addCell(String.valueOf(order.getOrderId()));

                    table.addCell(order.getSupplier().getSupplierName());

                    table.addCell(item.getMedicine().getMedicineName());

                    table.addCell(String.valueOf(item.getQuantity()));

                    table.addCell(String.valueOf(order.getOrderDate()));

                    table.addCell(String.valueOf(order.getExpectedDelivery()));

                    table.addCell(order.getStatus());

                    table.addCell(String.valueOf(order.getTotalAmount()));
                }
            }

            document.add(table);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Report report = new Report();

            report.setReportName("Purchase Order Report");
            report.setGeneratedBy(user);
            report.setGeneratedOn(LocalDateTime.now());

            reportRepository.save(report);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Failed to generate Purchase Order Report", e);
        }
    }
}