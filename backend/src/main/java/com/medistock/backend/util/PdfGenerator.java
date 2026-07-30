package com.medistock.backend.util;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Component;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.entity.Supplier;

@Component
public class PdfGenerator {

    /* ===========================
       Inventory Report
       =========================== */

    public ByteArrayOutputStream generateInventoryReport(List<Inventory> inventoryList)
            throws DocumentException {

        Document document = new Document();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

        Paragraph title = new Paragraph("Inventory Report", titleFont);

        title.setSpacingAfter(20);

        document.add(title);

        PdfPTable table = new PdfPTable(4);

        table.setWidthPercentage(100);

        table.addCell(createHeader("Medicine"));
        table.addCell(createHeader("Available"));
        table.addCell(createHeader("Minimum"));
        table.addCell(createHeader("Updated"));

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

        for (Inventory inventory : inventoryList) {

            table.addCell(inventory.getMedicine().getMedicineName());

            table.addCell(String.valueOf(inventory.getQuantityAvailable()));

            table.addCell(String.valueOf(inventory.getMinimumStock()));

            table.addCell(
                    inventory.getLastUpdated().format(formatter)
            );
        }

        document.add(table);

        document.close();

        return out;
    }

    /* ===========================
       Purchase Report
       =========================== */

    public ByteArrayOutputStream generatePurchaseReport(List<PurchaseOrder> orders)
            throws DocumentException {

        Document document = new Document();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

        document.add(new Paragraph("Purchase Orders Report", titleFont));

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(5);

        table.setWidthPercentage(100);

        table.addCell(createHeader("Medicine"));
        table.addCell(createHeader("Supplier"));
        table.addCell(createHeader("Quantity"));
        table.addCell(createHeader("Date"));
        table.addCell(createHeader("Status"));

        for (PurchaseOrder order : orders) {

            table.addCell(order.getMedicine().getMedicineName());

            table.addCell(order.getSupplier().getSupplierName());

            table.addCell(String.valueOf(order.getQuantity()));

            table.addCell(order.getPurchaseDate().toString());

            table.addCell(order.getStatus());
        }

        document.add(table);

        document.close();

        return out;
    }

    /* ===========================
       Supplier Report
       =========================== */

    public ByteArrayOutputStream generateSupplierReport(List<Supplier> suppliers)
            throws DocumentException {

        Document document = new Document();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

        document.add(new Paragraph("Supplier Report", titleFont));

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(4);

        table.setWidthPercentage(100);

        table.addCell(createHeader("Supplier"));
        table.addCell(createHeader("Phone"));
        table.addCell(createHeader("Email"));
        table.addCell(createHeader("Address"));

        for (Supplier supplier : suppliers) {

            table.addCell(supplier.getSupplierName());

            table.addCell(supplier.getContactNumber());

            table.addCell(supplier.getEmail());

            table.addCell(supplier.getAddress());
        }

        document.add(table);

        document.close();

        return out;
    }

    /* ===========================
       Low Stock Report
       =========================== */

    public ByteArrayOutputStream generateLowStockReport(List<Medicine> medicines)
            throws DocumentException {

        Document document = new Document();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

        document.add(new Paragraph("Low Stock Report", titleFont));

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(3);

        table.setWidthPercentage(100);

        table.addCell(createHeader("Medicine"));

        table.addCell(createHeader("Category"));

        table.addCell(createHeader("Quantity"));

        for (Medicine medicine : medicines) {

            if (medicine.getQuantity() <= 20) {

                table.addCell(medicine.getMedicineName());

                table.addCell(medicine.getCategory());

                table.addCell(String.valueOf(medicine.getQuantity()));
            }
        }

        document.add(table);

        document.close();

        return out;
    }

    /* ===========================
       Common Header Cell
       =========================== */

    private PdfPCell createHeader(String text) {

        Font font = FontFactory.getFont(
                FontFactory.HELVETICA_BOLD
        );

        PdfPCell cell = new PdfPCell(new Phrase(text, font));

        return cell;
    }
}