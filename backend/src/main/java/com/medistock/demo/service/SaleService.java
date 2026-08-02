package com.medistock.demo.service;


import com.medistock.demo.dto.SaleRequest;
import com.medistock.demo.entity.Medicine;
import com.medistock.demo.entity.Sale;
import com.medistock.demo.entity.User;

import com.medistock.demo.repository.MedicineRepository;
import com.medistock.demo.repository.SaleRepository;
import com.medistock.demo.repository.UserRepository;


import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import java.util.List;


@Service
public class SaleService {


    private final SaleRepository saleRepository;

    private final MedicineRepository medicineRepository;

    private final UserRepository userRepository;

    private final NotificationService notificationService;


    public SaleService(

            SaleRepository saleRepository,

            MedicineRepository medicineRepository,

            UserRepository userRepository,

            NotificationService notificationService

    ){

        this.saleRepository = saleRepository;

        this.medicineRepository = medicineRepository;

        this.userRepository = userRepository;

        this.notificationService = notificationService;

    }


    // ==========================================
    // SELL SINGLE MEDICINE
    // ==========================================

    public Sale sellMedicine(

            SaleRequest request,

            Long userId

    ){

        Medicine medicine =

                medicineRepository

                        .findById(request.getMedicineId())

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Medicine not found"
                                )

                        );


        // ==========================================
        // STOCK CHECK
        // ==========================================

        if(medicine.getQuantity()
                < request.getQuantity()){

            throw new RuntimeException(
                    "Insufficient stock"
            );

        }


        // ==========================================
        // REDUCE STOCK
        // ==========================================

        medicine.setQuantity(

                medicine.getQuantity()

                -

                request.getQuantity()

        );


        Medicine updatedMedicine =

                medicineRepository.save(medicine);


        // ==========================================
        // FIND USER
        // ==========================================

        User user =

                userRepository

                        .findById(userId)

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "User not found"
                                )

                        );


        // ==========================================
        // CREATE SALE
        // ==========================================

        Sale sale = new Sale();


        sale.setMedicine(updatedMedicine);


        sale.setQuantity(
                request.getQuantity()
        );


        sale.setTotalAmount(

                updatedMedicine.getSellingPrice()

                        *

                request.getQuantity()

        );


        sale.setSoldBy(user);


        Sale savedSale =

                saleRepository.save(sale);


        // ==========================================
        // SALE NOTIFICATION
        // ==========================================

        notificationService.medicineSold(

                updatedMedicine.getName(),

                request.getQuantity()

        );


        // ==========================================
        // LOW STOCK ALERT
        // ==========================================

        checkLowStock(updatedMedicine);


        // ==========================================
        // EXPIRY ALERT
        // ==========================================

        checkExpiry(updatedMedicine);


        return savedSale;

    }


    // ==========================================
    // SELL MULTIPLE MEDICINES
    // ==========================================

    public List<Sale> sellMultipleMedicines(

            List<SaleRequest> requests,

            Long userId

    ){

        return requests.stream()

                .map(request ->

                        sellMedicine(
                                request,
                                userId
                        )

                )

                .toList();

    }


    // ==========================================
    // LOW STOCK CHECK
    // ==========================================

    private void checkLowStock(

            Medicine medicine

    ){

        if(

                medicine.getQuantity()

                        <=

                medicine.getMinStockLevel()

        ){

            notificationService.createStockAlert(

                    medicine.getName(),

                    medicine.getQuantity()

            );

        }

    }


    // ==========================================
    // EXPIRY CHECK
    // ==========================================

    private void checkExpiry(

            Medicine medicine

    ){

        if(medicine.getExpiryDate() == null){

            return;

        }


        long days =

                ChronoUnit.DAYS.between(

                        LocalDate.now(),

                        medicine.getExpiryDate()

                );


        if(days >= 0 && days <= 30){

            notificationService.createExpiryAlert(

                    medicine.getName(),

                    days

            );

        }

    }


    // ==========================================
    // SALES HISTORY BY USER
    // ==========================================

    public List<Sale> history(

            Long userId

    ){

        return saleRepository
                .findBySoldById(userId);

    }


    // ==========================================
    // ALL SALES
    // ==========================================

    public List<Sale> getAllSales(){

        return saleRepository.findAll();

    }

}