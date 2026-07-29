package com.medistock.demo.service;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.repository.MedicineRepository;

import org.springframework.stereotype.Service;

import java.util.List;



@Service
public class StockAlertService {



    private final MedicineRepository medicineRepository;


    private final NotificationService notificationService;




    public StockAlertService(
            MedicineRepository medicineRepository,
            NotificationService notificationService
    ){

        this.medicineRepository = medicineRepository;

        this.notificationService = notificationService;

    }






    // =====================================
    // CHECK LOW STOCK MEDICINES
    // =====================================

    public List<Medicine> checkLowStock(){


        List<Medicine> medicines =
                medicineRepository.findAll();



        for(Medicine medicine : medicines){


            if(medicine.isLowStock()){



                notificationService.createNotification(

                        "Low Stock Alert",

                        medicine.getName()
                        +" stock is low. Available quantity: "
                        +medicine.getQuantity(),

                        "STOCK"

                );



            }


        }



        return medicines.stream()

                .filter(Medicine::isLowStock)

               .toList();


    }




}