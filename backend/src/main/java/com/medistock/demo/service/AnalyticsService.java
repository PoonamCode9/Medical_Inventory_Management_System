package com.medistock.demo.service;


import com.medistock.demo.dto.AnalyticsResponse;
import com.medistock.demo.repository.MedicineRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;



@Service
public class AnalyticsService {


    private final MedicineRepository medicineRepository;



    public AnalyticsService(
            MedicineRepository medicineRepository
    ){

        this.medicineRepository = medicineRepository;

    }








    public AnalyticsResponse getAnalytics(){


        AnalyticsResponse response =
                new AnalyticsResponse();






        // ==============================
        // TOTAL MEDICINES
        // ==============================

        response.setTotalMedicines(

                medicineRepository.count()

        );








        // ==============================
        // TOTAL STOCK
        // ==============================

        response.setTotalStock(

                medicineRepository.getTotalStock()

        );








        // ==============================
        // LOW STOCK COUNT
        // Uses minStockLevel
        // ==============================

        response.setLowStockCount(

                medicineRepository
                        .countLowStockMedicines()

        );








        // ==============================
        // EXPIRED MEDICINES
        // ==============================

        response.setExpiredCount(

                medicineRepository
                        .countByExpiryDateBefore(

                                LocalDate.now()

                        )

        );








        // ==============================
        // NEAR EXPIRY
        // Next 30 Days
        // ==============================

        response.setNearExpiryCount(

                medicineRepository
                        .findNearExpiry(

                                LocalDate.now(),

                                LocalDate.now()
                                        .plusDays(30)

                        )
                        .size()

        );








        // ==============================
        // INVENTORY VALUE
        // ==============================

        response.setInventoryValue(

                medicineRepository
                        .getTotalStockValue()

        );








        // ==============================
        // CATEGORY ANALYTICS
        // ==============================


        response.setTabletCount(

                medicineRepository
                        .countByCategory("Tablet")

        );




        response.setSyrupCount(

                medicineRepository
                        .countByCategory("Syrup")

        );




        response.setInjectionCount(

                medicineRepository
                        .countByCategory("Injection")

        );








        return response;


    }



}