package com.medistock.backend.controller;

import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.repository.SupplierRepository;

import com.medistock.backend.entity.Medicine;
import com.medistock.backend.repository.MedicineRepository;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;


@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {


    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;

    public ReportController(MedicineRepository medicineRepository,
                            SupplierRepository supplierRepository) {
        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
    }
    @GetMapping("/stock/download")
    public ResponseEntity<byte[]> downloadStockReport() throws Exception {


        List<Medicine> medicines = medicineRepository.findAll();


        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();


        Document document = new Document();


        PdfWriter.getInstance(document, outputStream);


        document.open();


        document.add(
                new Paragraph("MediStock - Medicine Stock Report")
        );


        document.add(
                new Paragraph(" ")
        );


        PdfPTable table = new PdfPTable(8);

        table.setWidthPercentage(100);


        // Table headings

        table.addCell("ID");
        table.addCell("Medicine Name");
        table.addCell("Batch");
        table.addCell("Category");
        table.addCell("Supplier");
        table.addCell("Quantity");
        table.addCell("Expiry Date");
        table.addCell("Price");


        // Medicine data

        for (Medicine medicine : medicines) {


            table.addCell(
                    String.valueOf(medicine.getId())
            );


            table.addCell(
                    medicine.getName()
            );


            table.addCell(
                    medicine.getBatchNumber()
            );


            table.addCell(
                    medicine.getCategory()
            );


            table.addCell(
                    medicine.getSupplier()
            );


            table.addCell(
                    String.valueOf(medicine.getQuantity())
            );


            table.addCell(
                    String.valueOf(medicine.getExpiryDate())
            );


            table.addCell(
                    String.valueOf(medicine.getPrice())
            );


        }


        document.add(table);


        document.close();


        byte[] pdf = outputStream.toByteArray();


        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Medicine_Stock_Report.pdf"
                )

                .contentType(MediaType.APPLICATION_PDF)

                .body(pdf);

    }
    @GetMapping("/expiry/download")
    public ResponseEntity<byte[]> downloadExpiryReport() throws Exception {

        List<Medicine> medicines = medicineRepository.findAll();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);

        document.open();
        document.add(new Paragraph("MediStock - Expiry Report"));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);

        table.addCell("Medicine");
        table.addCell("Batch");
        table.addCell("Expiry Date");

        for (Medicine medicine : medicines) {
            table.addCell(medicine.getName());
            table.addCell(medicine.getBatchNumber());
            table.addCell(String.valueOf(medicine.getExpiryDate()));
        }

        document.add(table);
        document.close();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Expiry_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(outputStream.toByteArray());
    }
    @GetMapping("/supplier/download")
    public ResponseEntity<byte[]> downloadSupplierReport() throws Exception {

        List<Supplier> suppliers = supplierRepository.findAll();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);

        document.open();
        document.add(new Paragraph("MediStock - Supplier Report"));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        table.addCell("ID");
        table.addCell("Supplier Name");
        table.addCell("Phone");
        table.addCell("Email");

        for (Supplier supplier : suppliers) {
            table.addCell(String.valueOf(supplier.getId()));
            table.addCell(supplier.getSupplierName());   // ✅ Correct
            table.addCell(supplier.getPhone());
            table.addCell(supplier.getEmail());
        }

        document.add(table);
        document.close();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Supplier_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(outputStream.toByteArray());
    }

}