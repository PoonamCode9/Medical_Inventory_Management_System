package com.medistock.api.dto;

import com.medistock.api.models.StockLog;

import java.time.LocalDateTime;

public class StockLogDTO {

    private Long id;
    private Long medicineId;
    private String medicineName;
    private String batchNumber;
    private String username;
    private String movementType;
    private Integer quantity;
    private String reason;
    private LocalDateTime timestamp;

    public static StockLogDTO fromEntity(StockLog log) {
        StockLogDTO dto = new StockLogDTO();
        dto.id = log.getId();
        if (log.getMedicine() != null) {
            dto.medicineId   = log.getMedicine().getId();
            dto.medicineName = log.getMedicine().getName();
            dto.batchNumber  = log.getMedicine().getBatchNumber();
        } else {
            dto.medicineName = "Unknown";
        }
        dto.username     = log.getUser() != null ? log.getUser().getUsername() : "System";
        dto.movementType = log.getMovementType().name();
        dto.quantity     = log.getQuantity();
        dto.reason       = log.getReason();
        dto.timestamp    = log.getTimestamp();
        return dto;
    }

    public Long getId()            { return id; }
    public Long getMedicineId()    { return medicineId; }
    public String getMedicineName(){ return medicineName; }
    public String getBatchNumber() { return batchNumber; }
    public String getUsername()    { return username; }
    public String getMovementType(){ return movementType; }
    public Integer getQuantity()   { return quantity; }
    public String getReason()      { return reason; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
