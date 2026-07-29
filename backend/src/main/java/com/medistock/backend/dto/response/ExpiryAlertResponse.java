package com.medistock.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpiryAlertResponse {
    private Integer medicineId;
    private String medicineName;
    private String batchNumber;
    private LocalDate expiryDate;
    private Long daysRemaining;
    private String status; // "EXPIRED", "7 Days Remaining", "15 Days Remaining", "30 Days Remaining", "STABLE"
}
