package com.medicalinventory.backend.controller;

import com.medicalinventory.backend.dto.ReportRequestDTO;
import com.medicalinventory.backend.service.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/download")
    public ResponseEntity<InputStreamResource> downloadReport(@RequestBody ReportRequestDTO requestDTO, Authentication authentication) {
        String userEmail = authentication.getName(); 

        ByteArrayInputStream stream = reportService.generateReport(requestDTO, userEmail);

        String filename = requestDTO.getReportType().toLowerCase() + "_report";
        MediaType mediaType;

        if ("EXCEL".equalsIgnoreCase(requestDTO.getFormat())) {
            filename += ".xlsx";
            mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        } else {
            filename += ".pdf";
            mediaType = MediaType.APPLICATION_PDF;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + filename);

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(mediaType)
                .body(new InputStreamResource(stream));
    }
}