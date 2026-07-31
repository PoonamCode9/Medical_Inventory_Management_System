package com.example.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class ChartDataResponseDto {

    private List<MonthlyDataPoint> monthlyDispensesVsPurchases;
    private List<CategoryDataPoint> medicineCategoryDistribution;
    private List<TopSellingMedicine> topSellingMedicines;

    public ChartDataResponseDto() {
    }

    public List<MonthlyDataPoint> getMonthlyDispensesVsPurchases() {
        return monthlyDispensesVsPurchases;
    }

    public void setMonthlyDispensesVsPurchases(List<MonthlyDataPoint> monthlyDispensesVsPurchases) {
        this.monthlyDispensesVsPurchases = monthlyDispensesVsPurchases;
    }

    public List<CategoryDataPoint> getMedicineCategoryDistribution() {
        return medicineCategoryDistribution;
    }

    public void setMedicineCategoryDistribution(List<CategoryDataPoint> medicineCategoryDistribution) {
        this.medicineCategoryDistribution = medicineCategoryDistribution;
    }

    public List<TopSellingMedicine> getTopSellingMedicines() {
        return topSellingMedicines;
    }

    public void setTopSellingMedicines(List<TopSellingMedicine> topSellingMedicines) {
        this.topSellingMedicines = topSellingMedicines;
    }

    // ─── Inner classes ────────────────────────────────────────

    public static class MonthlyDataPoint {
        private String month;
        private long dispenses;
        private long purchases;

        public MonthlyDataPoint() {
        }

        public MonthlyDataPoint(String month, long dispenses, long purchases) {
            this.month = month;
            this.dispenses = dispenses;
            this.purchases = purchases;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public long getDispenses() {
            return dispenses;
        }

        public void setDispenses(long dispenses) {
            this.dispenses = dispenses;
        }

        public long getPurchases() {
            return purchases;
        }

        public void setPurchases(long purchases) {
            this.purchases = purchases;
        }
    }

    public static class CategoryDataPoint {
        private String category;
        private long count;

        public CategoryDataPoint() {
        }

        public CategoryDataPoint(String category, long count) {
            this.category = category;
            this.count = count;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class TopSellingMedicine {
        private String medicineName;
        private long totalQuantityDispensed;

        public TopSellingMedicine() {
        }

        public TopSellingMedicine(String medicineName, long totalQuantityDispensed) {
            this.medicineName = medicineName;
            this.totalQuantityDispensed = totalQuantityDispensed;
        }

        public String getMedicineName() {
            return medicineName;
        }

        public void setMedicineName(String medicineName) {
            this.medicineName = medicineName;
        }

        public long getTotalQuantityDispensed() {
            return totalQuantityDispensed;
        }

        public void setTotalQuantityDispensed(long totalQuantityDispensed) {
            this.totalQuantityDispensed = totalQuantityDispensed;
        }
    }
}

