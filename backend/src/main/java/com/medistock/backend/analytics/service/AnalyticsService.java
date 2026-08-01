package com.medistock.backend.analytics.service;

import com.medistock.backend.analytics.dto.AnalyticsResponse;
import java.time.LocalDate;

public interface AnalyticsService {
    AnalyticsResponse getAnalyticsDashboard(
            LocalDate startDate,
            LocalDate endDate,
            Integer categoryId,
            Integer supplierId,
            String stockStatus,
            String expiryStatus
    );
}
