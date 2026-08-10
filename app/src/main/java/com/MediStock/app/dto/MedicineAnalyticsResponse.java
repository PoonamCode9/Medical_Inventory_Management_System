package com.MediStock.app.dto;

import java.math.BigDecimal;

public class MedicineAnalyticsResponse {

    private Long totalMedicines;

    private Long totalCategories;

    private BigDecimal averagePrice;

    private BigDecimal highestPrice;

    private BigDecimal lowestPrice;

    public MedicineAnalyticsResponse() {
    }

    public Long getTotalMedicines() {
        return totalMedicines;
    }

    public void setTotalMedicines(Long totalMedicines) {
        this.totalMedicines = totalMedicines;
    }

    public Long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }

    public BigDecimal getHighestPrice() {
        return highestPrice;
    }

    public void setHighestPrice(BigDecimal highestPrice) {
        this.highestPrice = highestPrice;
    }

    public BigDecimal getLowestPrice() {
        return lowestPrice;
    }

    public void setLowestPrice(BigDecimal lowestPrice) {
        this.lowestPrice = lowestPrice;
    }

}