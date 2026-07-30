package com.medistock.backend.service;

import java.io.ByteArrayOutputStream;
import java.util.List;

import com.medistock.backend.dto.ReportDTO;
import com.medistock.backend.dto.ReportRequest;

public interface ReportService {

    // Report History
    List<ReportDTO> getAllReports();

    ReportDTO createReport(ReportRequest request);

    void deleteReport(Integer id);

    // PDF Reports
    ByteArrayOutputStream generateInventoryReport(Integer userId);

    ByteArrayOutputStream generateSupplierReport(Integer userId);

    ByteArrayOutputStream generatePurchaseReport(Integer userId);

    ByteArrayOutputStream generateLowStockReport(Integer userId);

}