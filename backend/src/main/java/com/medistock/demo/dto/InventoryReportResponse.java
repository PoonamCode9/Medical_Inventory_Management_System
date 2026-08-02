package com.medistock.demo.dto;


import com.medistock.demo.entity.Medicine;

import lombok.Data;

import java.util.List;



@Data
public class InventoryReportResponse {


    private long totalMedicines;


    private long totalStock;


    private List<Medicine> lowStock;


    private List<Medicine> expiredMedicines;



    public InventoryReportResponse(
            long totalMedicines,
            long totalStock,
            List<Medicine> lowStock,
            List<Medicine> expiredMedicines
    ){

        this.totalMedicines = totalMedicines;

        this.totalStock = totalStock;

        this.lowStock = lowStock;

        this.expiredMedicines = expiredMedicines;

    }


}