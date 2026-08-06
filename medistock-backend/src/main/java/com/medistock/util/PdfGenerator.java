package com.medistock.util;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.medistock.entity.Medicine;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class PdfGenerator {

    public static void generate(List<Medicine> medicines,
                                HttpServletResponse response)
            throws IOException {

        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);

        Paragraph title = new Paragraph("Medicine Inventory Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(6);

        table.setWidthPercentage(100);

        table.addCell("ID");
        table.addCell("Medicine");
        table.addCell("Category");
        table.addCell("Quantity");
        table.addCell("Price");
        table.addCell("Expiry");

        for (Medicine m : medicines) {

            table.addCell(String.valueOf(m.getId()));
            table.addCell(m.getMedicineName());
            table.addCell(m.getCategory());
            table.addCell(String.valueOf(m.getQuantity()));
            table.addCell(String.valueOf(m.getPrice()));
            table.addCell(m.getExpiryDate().toString());

        }

        document.add(table);

        document.close();
    }
}