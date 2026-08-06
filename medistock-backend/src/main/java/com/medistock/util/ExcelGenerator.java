package com.medistock.util;

import com.medistock.entity.Medicine;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public class ExcelGenerator {

    public static void generateExcel(

            List<Medicine> medicines,

            HttpServletResponse response)

            throws IOException {

        Workbook workbook=new XSSFWorkbook();

        Sheet sheet=workbook.createSheet("Medicines");

        Row header=sheet.createRow(0);

        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("Medicine");
        header.createCell(2).setCellValue("Category");
        header.createCell(3).setCellValue("Quantity");
        header.createCell(4).setCellValue("Price");
        header.createCell(5).setCellValue("Expiry");

        int rowCount=1;

        for(Medicine m:medicines){

            Row row=sheet.createRow(rowCount++);

            row.createCell(0).setCellValue(m.getId());

            row.createCell(1).setCellValue(m.getMedicineName());

            row.createCell(2).setCellValue(m.getCategory());

            row.createCell(3).setCellValue(m.getQuantity());

            row.createCell(4).setCellValue(m.getPrice());

            row.createCell(5).setCellValue(
                    m.getExpiryDate().toString()
            );

        }

        ServletOutputStream output=
                response.getOutputStream();

        workbook.write(output);

        workbook.close();

        output.close();

    }

}