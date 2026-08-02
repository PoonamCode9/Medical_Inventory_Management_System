package com.medistock.demo.service;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.entity.User;

import com.medistock.demo.repository.MedicineRepository;
import com.medistock.demo.repository.UserRepository;


import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import java.util.ArrayList;
import java.util.List;



@Service
public class InventoryAlertScheduler {



    private final MedicineRepository medicineRepository;

    private final UserRepository userRepository;

    private final NotificationService notificationService;

    private final EmailService emailService;




    public InventoryAlertScheduler(

            MedicineRepository medicineRepository,

            UserRepository userRepository,

            NotificationService notificationService,

            EmailService emailService

    ){

        this.medicineRepository = medicineRepository;

        this.userRepository = userRepository;

        this.notificationService = notificationService;

        this.emailService = emailService;

    }









    /*
       TESTING:
       Every 1 minute

       Production:

       @Scheduled(cron = "0 0 8 * * ?")

    */


    @Scheduled(
            fixedRate = 60000
    )
    public void checkInventoryAlerts(){



        System.out.println(
                "Inventory Scheduler Running..."
        );



        checkLowStock();


        checkNearExpiry();


        checkExpiredMedicines();



        System.out.println(
                "Inventory Scheduler Completed..."
        );


    }









    // =================================================
    // LOW STOCK
    // =================================================


    private void checkLowStock(){



        List<Medicine> medicines =

                medicineRepository.findLowStockMedicines();




        for(Medicine medicine : medicines){



            notificationService.createStockAlert(

                    medicine.getName(),

                    medicine.getQuantity()

            );





            sendEmailToUsers(

                    "Low Stock Alert - MediStock",

                    medicine,

                    "LOW_STOCK"

            );


        }


    }









    // =================================================
    // NEAR EXPIRY
    // =================================================


    private void checkNearExpiry(){



        LocalDate today =
                LocalDate.now();



        LocalDate next30Days =
                today.plusDays(30);




        List<Medicine> medicines =

                medicineRepository.findNearExpiry(

                        today,

                        next30Days

                );






        for(Medicine medicine : medicines){



            long days =

                    ChronoUnit.DAYS.between(

                            today,

                            medicine.getExpiryDate()

                    );





            notificationService.createExpiryAlert(

                    medicine.getName(),

                    days

            );






            sendEmailToUsers(

                    "Expiry Alert - MediStock",

                    medicine,

                    "EXPIRY"

            );


        }


    }









    // =================================================
    // EXPIRED MEDICINE
    // =================================================


    private void checkExpiredMedicines(){



        List<Medicine> medicines =


                medicineRepository.findByExpiryDateBefore(

                        LocalDate.now()

                );






        for(Medicine medicine : medicines){



            notificationService.medicineExpired(

                    medicine.getName()

            );





            sendEmailToUsers(

                    "Expired Medicine Alert - MediStock",

                    medicine,

                    "EXPIRED"

            );


        }



    }









    // =================================================
    // SEND EMAIL TO ADMIN + PHARMACIST
    // =================================================


    private void sendEmailToUsers(

            String subject,

            Medicine medicine,

            String type

    ){



        List<User> users =
                new ArrayList<>();





        users.addAll(

                userRepository.findByRoleRoleName(
                        "ADMIN"
                )

        );



        users.addAll(

                userRepository.findByRoleRoleName(
                        "PHARMACIST"
                )

        );







        for(User user : users){



            if(user.getEmail()!=null &&

                    !user.getEmail().isBlank()

            ){



                try{


                    emailService.sendEmail(


                            user.getEmail(),


                            subject,


                            medicine.getName(),


                            medicine.getBatchNumber(),


                            medicine.getExpiryDate()
                                    .toString(),


                            medicine.getQuantity()


                    );


                }


                catch(Exception e){


                    System.out.println(

                            "Email Failed : "

                            +

                            e.getMessage()

                    );


                }



            }


        }



    }





}