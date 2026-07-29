package com.medistock.backend.service;

import com.medistock.backend.dto.response.ExpiryAlertResponse;
import java.util.List;

public interface ExpiryService {
    List<ExpiryAlertResponse> getExpiryAlerts();
    List<ExpiryAlertResponse> getExpiredMedicines();
    List<ExpiryAlertResponse> getCriticalMedicines();
    List<ExpiryAlertResponse> getExpiringMedicines();
    List<ExpiryAlertResponse> getSafeMedicines();
    java.util.Map<String, Long> getExpirySummary();
}
