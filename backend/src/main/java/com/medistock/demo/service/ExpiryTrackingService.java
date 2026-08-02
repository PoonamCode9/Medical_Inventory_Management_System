package com.medistock.demo.service;


import com.medistock.demo.entity.ExpiryTracking;
import com.medistock.demo.entity.Medicine;
import com.medistock.demo.repository.ExpiryTrackingRepository;


import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import java.util.List;



@Service
public class ExpiryTrackingService {



    private final ExpiryTrackingRepository repository;


    private final NotificationService notificationService;




    public ExpiryTrackingService(
            ExpiryTrackingRepository repository,
            NotificationService notificationService
    ){

        this.repository = repository;

        this.notificationService = notificationService;

    }






    // =====================================
    // CREATE / UPDATE EXPIRY TRACKING
    // =====================================


    public ExpiryTracking createExpiryTracking(
            Medicine medicine
    ){


        if(medicine.getExpiryDate()==null){

            throw new RuntimeException(
                    "Expiry date is required"
            );

        }





        ExpiryTracking expiry =

                repository.findByMedicineId(
                        medicine.getId()
                )
                .orElse(
                        new ExpiryTracking()
                );







        expiry.setMedicine(
                medicine
        );



        expiry.setExpiryDate(
                medicine.getExpiryDate()
        );







        long days =

                ChronoUnit.DAYS.between(

                        LocalDate.now(),

                        medicine.getExpiryDate()

                );






        expiry.setDaysRemaining(
                (int) days
        );







        // ===============================
        // STATUS
        // ===============================


        if(days < 0){


            expiry.setStatus(
                    "EXPIRED"
            );



            sendNotification(
                    expiry,
                    medicine,
                    "Medicine Expired",
                    medicine.getName()
                    + " has expired"
            );


        }



        else if(days <= 30){


            expiry.setStatus(
                    "EXPIRING_SOON"
            );



            sendNotification(
                    expiry,
                    medicine,
                    "Expiry Alert",
                    medicine.getName()
                    + " expires in "
                    + days
                    + " days"
            );


        }



        else{


            expiry.setStatus(
                    "ACTIVE"
            );


            expiry.setNotificationSent(
                    false
            );


        }







        return repository.save(expiry);

    }









    // =====================================
    // DELETE EXPIRY TRACKING BY MEDICINE
    // =====================================


    public void deleteByMedicine(
            Medicine medicine
    ){


        repository.deleteByMedicine(
                medicine
        );


    }









    // =====================================
    // NOTIFICATION HANDLER
    // =====================================


    private void sendNotification(

            ExpiryTracking expiry,

            Medicine medicine,

            String title,

            String message

    ){



        if(!Boolean.TRUE.equals(
                expiry.getNotificationSent()
        )){



            notificationService.createNotification(

                    title,

                    message,

                    "EXPIRY"

            );



            expiry.setNotificationSent(
                    true
            );


        }


    }









    // =====================================
    // GET ALL
    // =====================================


    public List<ExpiryTracking> getAll(){


        return repository.findAll();

    }









    // =====================================
    // EXPIRED
    // =====================================


    public List<ExpiryTracking> getExpired(){


        return repository.findByStatus(
                "EXPIRED"
        );


    }









    // =====================================
    // EXPIRING SOON
    // =====================================


    public List<ExpiryTracking> getExpiringSoon(){


        return repository.findByStatus(
                "EXPIRING_SOON"
        );


    }



}