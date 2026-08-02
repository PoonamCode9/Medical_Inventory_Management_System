package com.medicalinventory.backend.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.medicalinventory.backend.dto.ReportRequestDTO;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.Report;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.InventoryRepository;
import com.medicalinventory.backend.repository.ReportRepository;
import com.medicalinventory.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReportService {

    private final InventoryRepository inventoryRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportService(InventoryRepository inventoryRepository,
                         ReportRepository reportRepository,
                         UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ByteArrayInputStream generateReport(ReportRequestDTO requestDTO, String userEmail) {
        List<Inventory> inventoryList = inventoryRepository.findAll();

        if ("LOW_STOCK".equalsIgnoreCase(requestDTO.getReportType())) {
            inventoryList = inventoryList.stream()
                    .filter(inv -> inv.getQuantity() != null && inv.getQuantity() < 20)
                    .toList();
        } else if ("EXPIRY".equalsIgnoreCase(requestDTO.getReportType())) {
            LocalDate today = LocalDate.now();
            LocalDate next30Days = today.plusDays(30);

            inventoryList = inventoryList.stream()
                    .filter(inv -> {
                        if (inv.getMedicine() == null || inv.getMedicine().getExpiryDate() == null) {
                            return false;
                        }
                        LocalDate expiry = inv.getMedicine().getExpiryDate();
                        return expiry.isBefore(next30Days);
                    })
                    .toList();
        }

        String extension = "EXCEL".equalsIgnoreCase(requestDTO.getFormat()) ? ".xlsx" : ".pdf";
        String fileName = requestDTO.getReportType().toLowerCase() + "_report_" + System.currentTimeMillis() + extension;
        String reportName = requestDTO.getReportType() + " Report";

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        Report reportEntry = new Report(
                reportName,
                requestDTO.getReportType(),
                requestDTO.getFormat().toUpperCase(),
                user,
                LocalDateTime.now(),
                fileName
        );
        reportRepository.save(reportEntry);

        if ("EXCEL".equalsIgnoreCase(requestDTO.getFormat())) {
            return generateExcelReport(inventoryList, requestDTO.getReportType());
        } else {
            return generatePdfReport(inventoryList, requestDTO.getReportType());
        }
    }

    private String getExpiryStatus(LocalDate expiryDate) {
        if (expiryDate == null) return "N/A";
        
        LocalDate today = LocalDate.now();
        if (expiryDate.isBefore(today)) {
            return "EXPIRED";
        } else {
            long daysLeft = ChronoUnit.DAYS.between(today, expiryDate);
            return "Expiring in " + daysLeft + " days";
        }
    }

    // --- EXCEL GENERATION LOGIC ---
    private ByteArrayInputStream generateExcelReport(List<Inventory> inventoryList, String reportType) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Inventory Report");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            boolean isExpiryReport = "EXPIRY".equalsIgnoreCase(reportType);

            String[] headers = isExpiryReport 
                    ? new String[]{"ID", "Medicine Name", "Category", "Batch No", "Supplier", "Quantity", "Price (₹)", "Expiry Date", "Status"}
                    : new String[]{"ID", "Medicine Name", "Category", "Batch No", "Supplier", "Quantity", "Price (₹)", "Expiry Date"};

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Inventory inv : inventoryList) {
                Medicine med = inv.getMedicine();
                if (med == null) continue;

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

    // --- PDF GENERATION LOGIC ---
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
                    ? new String[]{"Name", "Category", "Batch", "Supplier", "Qty", "Price", "Expiry", "Status"}
                    : new String[]{"Name", "Category", "Batch", "Supplier", "Qty", "Price", "Expiry"};

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                cell.setPadding(5);
                table.addCell(cell);
            }

            for (Inventory inv : inventoryList) {
                Medicine med = inv.getMedicine();
                if (med == null) continue;

                table.addCell(new Phrase(med.getMedicineName() != null ? med.getMedicineName() : "", FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(med.getCategory() != null ? med.getCategory() : "", FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(med.getBatchNo() != null ? med.getBatchNo() : "", FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(med.getSupplier() != null ? med.getSupplier().getSupplierName() : "N/A", FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(String.valueOf(inv.getQuantity()), FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase("₹" + (med.getPrice() != null ? med.getPrice() : "0"), FontFactory.getFont(FontFactory.HELVETICA, 8)));
                table.addCell(new Phrase(med.getExpiryDate() != null ? med.getExpiryDate().toString() : "", FontFactory.getFont(FontFactory.HELVETICA, 8)));
                
                if (isExpiryReport) {
                    table.addCell(new Phrase(getExpiryStatus(med.getExpiryDate()), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
                }
            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}