package com.medistock.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockLogResponse {
    private Integer stockLogId;
    private String action;
    private Integer oldQuantity;
    private Integer newQuantity;
    private String reason;
    private LocalDateTime updatedAt;
    private MedicineDto medicine;
    private UserDto user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicineDto {
        private Integer medicineId;
        private String medicineName;
        private String batchNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Integer userId;
        private String email;
    }
}
