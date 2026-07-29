package com.medistock.demo.service;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.entity.StockLog;
import com.medistock.demo.entity.User;

import com.medistock.demo.repository.StockLogRepository;
import com.medistock.demo.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;



@Service
public class StockLogService {



    private final StockLogRepository stockLogRepository;

    private final UserRepository userRepository;





    public StockLogService(

            StockLogRepository stockLogRepository,

            UserRepository userRepository

    ){

        this.stockLogRepository = stockLogRepository;

        this.userRepository = userRepository;

    }








    // =====================================
    // CREATE STOCK LOG
    // =====================================

    public StockLog createLog(


            Medicine medicine,


            String operation,


            int oldQuantity,


            int newQuantity


    ){



        StockLog log = new StockLog();



        log.setMedicine(

                medicine

        );





        log.setOperation(

                operation.toUpperCase()

        );





        log.setOldQuantity(

                oldQuantity

        );





        log.setNewQuantity(

                newQuantity

        );





        log.setQuantityChanged(


                Math.abs(

                        newQuantity - oldQuantity

                )


        );







        /*
         * Temporary system user
         * Later replace with
         * JWT logged-in user
         */


        User systemUser =

                userRepository.findById(1L)

                .orElse(null);





        log.setPerformedBy(

                systemUser

        );






        return stockLogRepository.save(log);


    }









    // =====================================
    // DELETE LOGS BY MEDICINE
    // =====================================


    @Transactional
    public void deleteByMedicine(

            Medicine medicine

    ){



        stockLogRepository

                .deleteByMedicine_Id(

                        medicine.getId()

                );


    }









    // =====================================
    // GET ALL STOCK LOGS
    // =====================================


    public List<StockLog> getAllLogs(){


        return stockLogRepository

                .findAll();


    }









    // =====================================
    // GET LOGS BY MEDICINE
    // =====================================


    public List<StockLog> getMedicineLogs(

            Long medicineId

    ){



        return stockLogRepository

                .findByMedicine_Id(

                        medicineId

                );


    }



}