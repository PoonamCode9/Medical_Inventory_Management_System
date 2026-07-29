package com.medistock.backend.controller;

import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.service.NotificationService;
import com.medistock.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
public class ReportController {

    private final ReportService reportService;
    private final NotificationService notificationService;

    @GetMapping("/download/{type}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable String type, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        String csvContent = reportService.generateCsvReport(type);
        byte[] bytes = csvContent.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        String filename = type + "_report_" + System.currentTimeMillis() + ".csv";

        notificationService.createNotification(
                email,
                "Reports Exported",
                "The \"" + type + "\" report was exported successfully.",
                "SUCCESS",
                "LOW",
                "REPORT",
                null
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @GetMapping("/data/{type}")
    public ResponseEntity<ApiResponse<List<?>>> getReportData(@PathVariable String type) {
        List<?> data = reportService.getReportData(type);
        return ResponseEntity.ok(ApiResponse.<List<?>>builder()
                .success(true)
                .message("Fetched report data for: " + type)
                .data(data)
                .build());
    }
}
