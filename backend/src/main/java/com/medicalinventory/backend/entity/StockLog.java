package com.medicalinventory.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "stock_logs")
public class StockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "quantity_changed", nullable = false)
    private Integer quantityChanged;

    @Column(nullable = false, length = 30)
    private String action;

    @Column(name = "log_date")
    private LocalDateTime logDate = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "quantity_before", nullable = false)
    private Integer quantityBefore;

    @Column(name = "quantity_after", nullable = false)
    private Integer quantityAfter;

    @Column(name = "performed_by", length = 100)
    private String performedBy;

    public StockLog() {}

    public StockLog(Medicine medicine, Integer quantityChanged, String action, String remarks, Integer quantityBefore,
        Integer quantityAfter, String performedBy) {
        this.medicine = medicine;
        this.quantityChanged = quantityChanged;
        this.action = action;
        this.remarks = remarks;
        this.logDate = LocalDateTime.now();
        this.quantityBefore = quantityBefore;
        this.quantityAfter = quantityAfter;
        this.performedBy = performedBy;
    }

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }

    public Integer getQuantityChanged() {
        return quantityChanged;
    }

    public void setQuantityChanged(Integer quantityChanged) {
        this.quantityChanged = quantityChanged;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDateTime logDate) {
        this.logDate = logDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Integer getQuantityBefore() {
        return quantityBefore;
    }

    public void setQuantityBefore(Integer quantityBefore) {
        this.quantityBefore = quantityBefore;
    }

    public Integer getQuantityAfter() {
        return quantityAfter;
    }

    public void setQuantityAfter(Integer quantityAfter) {
        this.quantityAfter = quantityAfter;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

}