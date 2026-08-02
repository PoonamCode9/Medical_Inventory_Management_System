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


    private final EmailService emailService;





    public ExpiryTrackingService(

            ExpiryTrackingRepository repository,

            NotificationService notificationService,

            EmailService emailService

    ){

        this.repository = repository;

        this.notificationService = notificationService;

        this.emailService = emailService;

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

                (int)days

        );







        // =================================
        // STATUS CHECK
        // =================================



        if(days < 0){



            expiry.setStatus(
                    "EXPIRED"
            );




            sendNotification(

                    expiry,

                    medicine,

                    "Medicine Expired",

                    medicine.getName()
                    +
                    " has expired"

            );



        }




        else if(days <=30){



            expiry.setStatus(
                    "EXPIRING_SOON"
            );





            sendNotification(

                    expiry,

                    medicine,

                    "Expiry Alert",

                    medicine.getName()
                    +
                    " expires in "
                    +
                    days
                    +
                    " days"

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
    // SEND NOTIFICATION + EMAIL
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






            // ===============================
            // SYSTEM NOTIFICATION
            // ===============================



            notificationService.createNotification(


                    title,


                    message,


                    "EXPIRY"


            );







            // ===============================
            // EMAIL ALERT
            // ===============================



            try {



                emailService.sendEmail(



                        "kalyanamshanthipriya021@gmail.com",



                        "MediStock - "
                        +
                        title,



                        medicine.getName(),



                        medicine.getBatchNumber(),



                        medicine.getExpiryDate()
                                .toString(),



                        medicine.getQuantity()



                );



            }


            catch(Exception e){



                System.out.println(
                        "Email sending failed : "
                        +
                        e.getMessage()
                );



            }







            expiry.setNotificationSent(

                    true

            );



        }



    }












    // =====================================
    // DELETE EXPIRY TRACKING
    // =====================================



    public void deleteByMedicine(

            Medicine medicine

    ){


        repository.deleteByMedicine(
                medicine
        );


    }












    // =====================================
    // GET ALL
    // =====================================


    public List<ExpiryTracking> getAll(){


        return repository.findAll();


    }












    // =====================================
    // GET EXPIRED MEDICINES
    // =====================================


    public List<ExpiryTracking> getExpired(){



        return repository.findByStatus(
                "EXPIRED"
        );



    }












    // =====================================
    // GET EXPIRING SOON
    // =====================================


    public List<ExpiryTracking> getExpiringSoon(){



        return repository.findByStatus(
                "EXPIRING_SOON"
        );



    }





}