package com.medistock.demo.service;


import com.medistock.demo.dto.InventoryReportResponse;
import com.medistock.demo.repository.MedicineRepository;

import org.springframework.stereotype.Service;


import java.time.LocalDate;



@Service
public class ReportService {


    private final MedicineRepository medicineRepository;



    public ReportService(
            MedicineRepository medicineRepository
    ){

        this.medicineRepository =
                medicineRepository;

    }






    public InventoryReportResponse getInventoryReport(){



        long totalMedicines =
                medicineRepository.count();



        long totalStock =
                medicineRepository
                .getTotalStock();



        var lowStock =
                medicineRepository
                .findLowStockMedicines();



        var expired =
                medicineRepository
                .findByExpiryDateBefore(
                        LocalDate.now()
                );




        return new InventoryReportResponse(

                totalMedicines,

                totalStock,

                lowStock,

                expired

        );


    }



}