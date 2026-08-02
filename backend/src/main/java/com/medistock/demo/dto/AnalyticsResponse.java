package com.medistock.demo.dto;


import lombok.Data;


@Data
public class AnalyticsResponse {



    private long totalMedicines;


    private long totalStock;


    private long lowStockCount;


    private long expiredCount;


    private long nearExpiryCount;


    private double inventoryValue;



    private long tabletCount;


    private long syrupCount;


    private long injectionCount;


}