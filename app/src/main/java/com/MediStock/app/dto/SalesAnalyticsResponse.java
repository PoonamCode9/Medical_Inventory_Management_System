package com.MediStock.app.dto;

import java.math.BigDecimal;

public class SalesAnalyticsResponse {

    /*
     |--------------------------------------------------------------------------
     | Total Sales
     |--------------------------------------------------------------------------
     *
     * Number of completed sale transactions.
     */

    private long totalSales;


    /*
     |--------------------------------------------------------------------------
     | Total Units Sold
     |--------------------------------------------------------------------------
     *
     * Total quantity of medicines sold
     * across all sale transactions.
     */

    private long totalUnitsSold;


    /*
     |--------------------------------------------------------------------------
     | Total Revenue
     |--------------------------------------------------------------------------
     *
     * Total amount generated from all sales.
     */

    private BigDecimal totalRevenue;


    /*
     |--------------------------------------------------------------------------
     | Average Sale Value
     |--------------------------------------------------------------------------
     *
     * Average monetary value per sale transaction.
     */

    private BigDecimal averageSaleValue;


    /*
     |--------------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------------
     */

    public SalesAnalyticsResponse() {

        this.totalRevenue =
                BigDecimal.ZERO;

        this.averageSaleValue =
                BigDecimal.ZERO;

    }


    /*
     |--------------------------------------------------------------------------
     | Total Sales
     |--------------------------------------------------------------------------
     */

    public long getTotalSales() {

        return totalSales;

    }

    public void setTotalSales(
            long totalSales
    ) {

        this.totalSales =
                totalSales;

    }


    /*
     |--------------------------------------------------------------------------
     | Total Units Sold
     |--------------------------------------------------------------------------
     */

    public long getTotalUnitsSold() {

        return totalUnitsSold;

    }

    public void setTotalUnitsSold(
            long totalUnitsSold
    ) {

        this.totalUnitsSold =
                totalUnitsSold;

    }


    /*
     |--------------------------------------------------------------------------
     | Total Revenue
     |--------------------------------------------------------------------------
     */

    public BigDecimal getTotalRevenue() {

        return totalRevenue;

    }

    public void setTotalRevenue(
            BigDecimal totalRevenue
    ) {

        this.totalRevenue =
                totalRevenue;

    }


    /*
     |--------------------------------------------------------------------------
     | Average Sale Value
     |--------------------------------------------------------------------------
     */

    public BigDecimal getAverageSaleValue() {

        return averageSaleValue;

    }

    public void setAverageSaleValue(
            BigDecimal averageSaleValue
    ) {

        this.averageSaleValue =
                averageSaleValue;

    }

}