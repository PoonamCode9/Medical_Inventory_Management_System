package com.medistock.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ReportService {
    List<Map<String, Object>> generateReport(String type, LocalDate startDate, LocalDate endDate);
}
