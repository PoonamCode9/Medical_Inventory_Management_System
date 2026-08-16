package com.MediStock.app.services;

import com.MediStock.app.dto.DashboardResponse;
import com.MediStock.app.dto.SaleResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    /*
     * ============================================================
     * DASHBOARD REPORT
     * ============================================================
     */

    DashboardResponse getDashboardReport();


    /*
     * ============================================================
     * SALES REPORTS
     * ============================================================
     */

    /*
     * Total revenue from all recorded sales.
     */
    BigDecimal getTotalSales();


    /*
     * Total number of completed sales transactions.
     */
    Long getTotalTransactions();


    /*
     * Total number of medicine units sold.
     */
    Long getTotalUnitsSold();


    /*
     * Total revenue between two dates.
     */
    BigDecimal getSalesBetween(
            LocalDate startDate,
            LocalDate endDate
    );


    /*
     * Detailed sales records between two dates.
     */
    List<SaleResponse> getSalesBetweenDates(
            LocalDate startDate,
            LocalDate endDate
    );

}