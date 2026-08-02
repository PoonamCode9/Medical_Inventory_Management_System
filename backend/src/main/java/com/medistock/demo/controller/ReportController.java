package com.medistock.demo.controller;


import com.medistock.demo.dto.InventoryReportResponse;
import com.medistock.demo.service.ReportPdfService;
import com.medistock.demo.service.ReportService;


import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {



    private final ReportPdfService reportPdfService;

    private final ReportService reportService;




    public ReportController(
            ReportPdfService reportPdfService,
            ReportService reportService
    ){

        this.reportPdfService = reportPdfService;

        this.reportService = reportService;

    }





    // =====================================
    // INVENTORY REPORT DATA
    // =====================================


    @GetMapping("/inventory")
    public ResponseEntity<InventoryReportResponse> inventoryReport(){


        return ResponseEntity.ok(

                reportService.getInventoryReport()

        );

    }







    // =====================================
    // DOWNLOAD INVENTORY PDF REPORT
    // =====================================


    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadPdf(){


        byte[] pdf = reportPdfService.generateInventoryReport();



        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=medistock-report.pdf"
                )

                .contentType(
                        MediaType.APPLICATION_PDF
                )

                .body(pdf);


    }





}