package com.medistock.backend.service;

public interface ReportService {
    String generateCsvReport(String type);
    java.util.List<?> getReportData(String type);
}
