package com.MediStock.app.services;

import com.MediStock.app.dto.SaleRequest;
import com.MediStock.app.dto.SaleResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface SaleService {

    SaleResponse createSale(SaleRequest request);

    List<SaleResponse> getAllSales();

    SaleResponse getSaleById(Long saleId);

    BigDecimal getTotalSales();

    Long getTotalTransactions();

    Long getTotalUnitsSold();

    BigDecimal getSalesBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    List<SaleResponse> getSalesBetweenDates(
            LocalDate startDate,
            LocalDate endDate
    );

}