package com.MediStock.app.controllers;

import com.MediStock.app.dto.SaleRequest;
import com.MediStock.app.dto.SaleResponse;
import com.MediStock.app.services.SaleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(
            SaleService saleService
    ) {

        this.saleService = saleService;

    }


    /*
     |--------------------------------------------------------------------------
     | Create Sale
     |--------------------------------------------------------------------------
     */

    @PostMapping
    public ResponseEntity<SaleResponse> createSale(
            @RequestBody SaleRequest request
    ) {

        SaleResponse response =
                saleService.createSale(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

    }


    /*
     |--------------------------------------------------------------------------
     | Get All Sales
     |--------------------------------------------------------------------------
     */

    @GetMapping
    public ResponseEntity<List<SaleResponse>> getAllSales() {

        return ResponseEntity.ok(
                saleService.getAllSales()
        );

    }


    /*
     |--------------------------------------------------------------------------
     | Get Sale By ID
     |--------------------------------------------------------------------------
     */

    @GetMapping("/{saleId}")
    public ResponseEntity<SaleResponse> getSaleById(
            @PathVariable Long saleId
    ) {

        return ResponseEntity.ok(
                saleService.getSaleById(
                        saleId
                )
        );

    }


    /*
     |--------------------------------------------------------------------------
     | Get Total Sales Revenue
     |--------------------------------------------------------------------------
     */

    @GetMapping("/revenue")
    public ResponseEntity<BigDecimal> getTotalSales() {

        return ResponseEntity.ok(
                saleService.getTotalSales()
        );

    }


    /*
     |--------------------------------------------------------------------------
     | Get Total Transactions
     |--------------------------------------------------------------------------
     */

    @GetMapping("/transactions")
    public ResponseEntity<Long> getTotalTransactions() {

        return ResponseEntity.ok(
                saleService.getTotalTransactions()
        );

    }


    /*
     |--------------------------------------------------------------------------
     | Get Total Units Sold
     |--------------------------------------------------------------------------
     */

    @GetMapping("/units")
    public ResponseEntity<Long> getTotalUnitsSold() {

        return ResponseEntity.ok(
                saleService.getTotalUnitsSold()
        );

    }


    /*
     |--------------------------------------------------------------------------
     | Get Sales Revenue Between Dates
     |--------------------------------------------------------------------------
     *
     * Example:
     *
     * GET /api/sales/revenue/range
     *     ?startDate=2026-08-01
     *     &endDate=2026-08-16
     *
     */

    @GetMapping("/revenue/range")
    public ResponseEntity<BigDecimal> getSalesBetween(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {

        return ResponseEntity.ok(
                saleService.getSalesBetween(
                        startDate,
                        endDate
                )
        );

    }


    /*
     |--------------------------------------------------------------------------
     | Get Sales Between Dates
     |--------------------------------------------------------------------------
     *
     * Example:
     *
     * GET /api/sales/range
     *     ?startDate=2026-08-01
     *     &endDate=2026-08-16
     *
     */

    @GetMapping("/range")
    public ResponseEntity<List<SaleResponse>> getSalesBetweenDates(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {

        return ResponseEntity.ok(
                saleService.getSalesBetweenDates(
                        startDate,
                        endDate
                )
        );

    }

}