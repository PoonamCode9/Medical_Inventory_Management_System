package com.medicalinventory.backend.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.medicalinventory.backend.dto.ReportRequestDTO;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.PurchaseOrder;
import com.medicalinventory.backend.entity.Report;
import com.medicalinventory.backend.entity.StockLog;
import com.medicalinventory.backend.entity.SystemSettings;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.InventoryRepository;
import com.medicalinventory.backend.repository.PurchaseOrderRepository;
import com.medicalinventory.backend.repository.ReportRepository;
import com.medicalinventory.backend.repository.StockLogRepository;
import com.medicalinventory.backend.repository.SystemSettingsRepository;
import com.medicalinventory.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReportService {

    private final InventoryRepository inventoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final StockLogRepository stockLogRepository;
    private final SystemSettingsRepository systemSettingsRepository;

    public ReportService(InventoryRepository inventoryRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            ReportRepository reportRepository,
            UserRepository userRepository,
            StockLogRepository stockLogRepository,
            SystemSettingsRepository systemSettingsRepository) {
        this.inventoryRepository = inventoryRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.stockLogRepository = stockLogRepository;
        this.systemSettingsRepository = systemSettingsRepository;
    }

    @Transactional
    public ByteArrayInputStream generateReport(ReportRequestDTO requestDTO, String userEmail) {
        String reportType = requestDTO.getReportType() != null ? requestDTO.getReportType().toUpperCase() : "";

        String extension = "EXCEL".equalsIgnoreCase(requestDTO.getFormat()) ? ".xlsx" : ".pdf";
        String fileName = reportType.toLowerCase() + "_report_" + System.currentTimeMillis() + extension;
        String reportName = reportType + " Report";

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        Report reportEntry = new Report(
                reportName,
                reportType,
                requestDTO.getFormat().toUpperCase(),
                user,
                LocalDateTime.now(),
                fileName);
        reportRepository.save(reportEntry);

        if ("PURCHASE".equalsIgnoreCase(reportType) || "PURCHASE_HISTORY".equalsIgnoreCase(reportType)) {
            List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findAll();

            if ("EXCEL".equalsIgnoreCase(requestDTO.getFormat())) {
                return generatePurchaseOrderExcelReport(purchaseOrders);
            } else {
                return generatePurchaseOrderPdfReport(purchaseOrders);
            }
        }

        if ("STOCK_MOVEMENT".equalsIgnoreCase(reportType)) {
            List<StockLog> stockLogs = stockLogRepository.findAllByOrderByLogDateDesc();

            if ("EXCEL".equalsIgnoreCase(requestDTO.getFormat())) {
                return generateStockLogExcelReport(stockLogs);
            } else {
                return generateStockLogPdfReport(stockLogs);
            }
        }

        SystemSettings settings = systemSettingsRepository.findById(1L).orElse(null);

        int lowStockThreshold = (settings != null && settings.getLowStockThreshold() != null)
                ? settings.getLowStockThreshold()
                : 10;

        int expiryDaysThreshold = (settings != null && settings.getExpiryAlertDays() != null)
                ? settings.getExpiryAlertDays()
                : 60;

        List<Inventory> inventoryList = inventoryRepository.findAll();

        if ("LOW_STOCK".equalsIgnoreCase(reportType)) {
            inventoryList = inventoryList.stream()
                    .filter(inv -> inv.getQuantity() != null && inv.getQuantity() <= lowStockThreshold)
                    .toList();
        } else if ("EXPIRY".equalsIgnoreCase(reportType)) {
            LocalDate today = LocalDate.now();
            LocalDate targetExpiryDate = today.plusDays(expiryDaysThreshold);

            inventoryList = inventoryList.stream()
                    .filter(inv -> {
                        if (inv.getMedicine() == null || inv.getMedicine().getExpiryDate() == null) {
                            return false;
                        }
                        LocalDate expiry = inv.getMedicine().getExpiryDate();
                        return !expiry.isAfter(targetExpiryDate);
                    })
                    .toList();
        }

        if ("EXCEL".equalsIgnoreCase(requestDTO.getFormat())) {
            return generateExcelReport(inventoryList, reportType);
        } else {
            return generatePdfReport(inventoryList, reportType);
        }
    }

    private String getExpiryStatus(LocalDate expiryDate) {
        if (expiryDate == null)
            return "N/A";

        LocalDate today = LocalDate.now();
        if (expiryDate.isBefore(today)) {
            return "EXPIRED";
        } else {
            long daysLeft = ChronoUnit.DAYS.between(today, expiryDate);
            return "Expiring in " + daysLeft + " days";
        }
    }

    // PURCHASE ORDER REPORT LOGIC (EXCEL & PDF)
    private ByteArrayInputStream generatePurchaseOrderExcelReport(List<PurchaseOrder> orders) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Purchase Orders");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] headers = new String[] {
                    "Order ID", "Medicine Name", "Supplier", "Ordered Qty", "Received Qty", "Damaged Qty", "Status",
                    "Remarks"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (PurchaseOrder po : orders) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(po.getOrderId() != null ? po.getOrderId() : 0);
                row.createCell(1).setCellValue(po.getMedicine() != null ? po.getMedicine().getMedicineName() : "N/A");
                row.createCell(2).setCellValue(po.getSupplier() != null ? po.getSupplier().getSupplierName() : "N/A");
                row.createCell(3).setCellValue(po.getQuantity() != null ? po.getQuantity() : 0);
                row.createCell(4).setCellValue(po.getReceivedQuantity() != null ? po.getReceivedQuantity() : 0);
                row.createCell(5).setCellValue(po.getDamagedQuantity() != null ? po.getDamagedQuantity() : 0);
                row.createCell(6).setCellValue(po.getStatus() != null ? po.getStatus() : "PENDING");
                row.createCell(7).setCellValue(po.getRemarks() != null ? po.getRemarks() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating Purchase Order Excel report", e);
        }
    }

    private ByteArrayInputStream generatePurchaseOrderPdfReport(List<PurchaseOrder> orders) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLUE);
            Paragraph title = new Paragraph("MediStock - Purchase Orders Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);

            String[] headers = new String[] {
                    "PO #", "Medicine", "Supplier", "Ordered Qty", "Received Qty", "Damaged Qty", "Status", "Remarks"
            };

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                cell.setPadding(5);
                table.addCell(cell);
            }

            for (PurchaseOrder po : orders) {
                table.addCell(new Phrase("#" + po.getOrderId(), FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(po.getMedicine() != null ? po.getMedicine().getMedicineName() : "N/A",
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(po.getSupplier() != null ? po.getSupplier().getSupplierName() : "N/A",
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(
                        new Phrase(String.valueOf(po.getQuantity()), FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(
                        new Phrase(String.valueOf(po.getReceivedQuantity() != null ? po.getReceivedQuantity() : 0),
                                FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(String.valueOf(po.getDamagedQuantity() != null ? po.getDamagedQuantity() : 0),
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(po.getStatus() != null ? po.getStatus() : "PENDING",
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
                table.addCell(new Phrase(po.getRemarks() != null ? po.getRemarks() : "—",
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating Purchase Order PDF report", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // Excel report logic
    private ByteArrayInputStream generateExcelReport(List<Inventory> inventoryList, String reportType) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Inventory Report");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            boolean isExpiryReport = "EXPIRY".equalsIgnoreCase(reportType);

            String[] headers = isExpiryReport
                    ? new String[] { "ID", "Medicine Name", "Category", "Batch No", "Supplier", "Quantity", "Price (₹)",
                            "Expiry Date", "Status" }
                    : new String[] { "ID", "Medicine Name", "Category", "Batch No", "Supplier", "Quantity", "Price (₹)",
                            "Expiry Date" };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Inventory inv : inventoryList) {
                Medicine med = inv.getMedicine();
                if (med == null)
                    continue;

                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(med.getMedicineId() != null ? med.getMedicineId() : 0);
                row.createCell(1).setCellValue(med.getMedicineName() != null ? med.getMedicineName() : "");
                row.createCell(2).setCellValue(med.getCategory() != null ? med.getCategory() : "");
                row.createCell(3).setCellValue(med.getBatchNo() != null ? med.getBatchNo() : "");
                row.createCell(4).setCellValue(med.getSupplier() != null ? med.getSupplier().getSupplierName() : "N/A");
                row.createCell(5).setCellValue(inv.getQuantity() != null ? inv.getQuantity() : 0);
                row.createCell(6).setCellValue(med.getPrice() != null ? med.getPrice().doubleValue() : 0.0);
                row.createCell(7).setCellValue(med.getExpiryDate() != null ? med.getExpiryDate().toString() : "");

                if (isExpiryReport) {
                    row.createCell(8).setCellValue(getExpiryStatus(med.getExpiryDate()));
                }
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel report", e);
        }
    }

    // PDF report logic
    private ByteArrayInputStream generatePdfReport(List<Inventory> inventoryList, String reportType) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLUE);
            Paragraph title = new Paragraph("MediStock - " + reportType + " Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            boolean isExpiryReport = "EXPIRY".equalsIgnoreCase(reportType);

            PdfPTable table = new PdfPTable(isExpiryReport ? 8 : 7);
            table.setWidthPercentage(100);

            String[] headers = isExpiryReport
                    ? new String[] { "Name", "Category", "Batch", "Supplier", "Qty", "Price", "Expiry", "Status" }
                    : new String[] { "Name", "Category", "Batch", "Supplier", "Qty", "Price", "Expiry" };

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                cell.setPadding(5);
                table.addCell(cell);
            }

            for (Inventory inv : inventoryList) {
                Medicine med = inv.getMedicine();
                if (med == null)
                    continue;

                table.addCell(new Phrase(med.getMedicineName() != null ? med.getMedicineName() : "",
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(med.getCategory() != null ? med.getCategory() : "",
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(med.getBatchNo() != null ? med.getBatchNo() : "",
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(med.getSupplier() != null ? med.getSupplier().getSupplierName() : "N/A",
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(
                        new Phrase(String.valueOf(inv.getQuantity()), FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase("₹" + (med.getPrice() != null ? med.getPrice() : "0"),
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(med.getExpiryDate() != null ? med.getExpiryDate().toString() : "",
                        FontFactory.getFont(FontFactory.HELVETICA, 8)));

                if (isExpiryReport) {
                    table.addCell(new Phrase(getExpiryStatus(med.getExpiryDate()),
                            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
                }
            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // STOCK MOVEMENT LOG REPORT (EXCEL & PDF)
    private ByteArrayInputStream generateStockLogExcelReport(List<StockLog> logs) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Stock Movement Logs");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a");

            String[] headers = new String[] {
                    "Medicine Name", "Batch No", "Action Type", "Qty Changed", "Stock Before", "Stock After",
                    "Performed By", "Remarks", "Date & Time"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (StockLog log : logs) {
                String medName = log.getMedicine() != null ? log.getMedicine().getMedicineName() : "N/A";
                String batchNo = (log.getMedicine() != null && log.getMedicine().getBatchNo() != null)
                        ? log.getMedicine().getBatchNo()
                        : "—";
                String formattedDate = log.getLogDate() != null ? log.getLogDate().format(formatter) : "";

                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(medName);
                row.createCell(1).setCellValue(batchNo);
                row.createCell(2).setCellValue(log.getAction() != null ? log.getAction() : "");
                row.createCell(3).setCellValue(log.getQuantityChanged() != null ? log.getQuantityChanged() : 0);
                row.createCell(4).setCellValue(log.getQuantityBefore() != null ? log.getQuantityBefore() : 0);
                row.createCell(5).setCellValue(log.getQuantityAfter() != null ? log.getQuantityAfter() : 0);
                row.createCell(6).setCellValue(log.getPerformedBy() != null ? log.getPerformedBy() : "System");
                row.createCell(7).setCellValue(log.getRemarks() != null ? log.getRemarks() : "");
                row.createCell(8).setCellValue(formattedDate); // Date & Time in LAST column
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating Stock Log Excel report", e);
        }
    }

    private ByteArrayInputStream generateStockLogPdfReport(List<StockLog> logs) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLUE);
            Paragraph title = new Paragraph("MediStock - Stock Movement Audit Log Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(15);
            document.add(title);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a");

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 2.2f, 1.8f, 1.8f, 1.0f, 2.0f, 1.6f, 2.3f });

            String[] headers = new String[] {
                    "Medicine Name", "Batch No", "Action", "Qty", "Stock (Before to After)", "Performed By",
                    "Date & Time"
            };

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                cell.setPadding(6);
                table.addCell(cell);
            }

            for (StockLog log : logs) {
                String medName = log.getMedicine() != null ? log.getMedicine().getMedicineName() : "N/A";
                String batchNo = (log.getMedicine() != null && log.getMedicine().getBatchNo() != null)
                        ? log.getMedicine().getBatchNo()
                        : "—";
                String action = log.getAction() != null ? log.getAction() : "";

                int qtyChanged = log.getQuantityChanged() != null ? log.getQuantityChanged() : 0;
                String qtyStr = (qtyChanged > 0 ? "+" : "") + qtyChanged;

                int before = log.getQuantityBefore() != null ? log.getQuantityBefore() : 0;
                int after = log.getQuantityAfter() != null ? log.getQuantityAfter() : 0;

                String stockFlow = before + " to " + after;

                String performedBy = log.getPerformedBy() != null ? log.getPerformedBy() : "System";
                String formattedDate = log.getLogDate() != null ? log.getLogDate().format(formatter) : "—";

                table.addCell(new Phrase(medName, FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(batchNo, FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(action, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
                table.addCell(new Phrase(qtyStr, FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(stockFlow, FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(performedBy, FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(formattedDate, FontFactory.getFont(FontFactory.HELVETICA, 8)));
            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating Stock Log PDF report", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}