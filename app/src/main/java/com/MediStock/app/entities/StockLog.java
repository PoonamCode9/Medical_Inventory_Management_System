package com.MediStock.app.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_logs")
public class StockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @Column(name = "batch_id")
    private Long batchId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "action_taken")
    private String actionTaken;

    @Column(name = "quantity_changed")
    private Integer quantityChanged;

    @Column(name = "log_date")
    private LocalDateTime logDate;

    public Long getLogId() {
        return logId;
    }
    public void setLogId(Long logId) {
        this.logId = logId;
    }
    public Long getBatchId() {
        return batchId;
    }
    public void setBatchId(Long batchId) {
        this.batchId = batchId;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getActionTaken() {
        return actionTaken;
    }
    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }
    public Integer getQuantityChanged() {
        return quantityChanged;
    }
    public void setQuantityChanged(Integer quantityChanged) {
        this.quantityChanged = quantityChanged;
    }
    public LocalDateTime getLogDate() {
        return logDate;
    }
    public void setLogDate(LocalDateTime logDate) {
        this.logDate = logDate;
    }
}