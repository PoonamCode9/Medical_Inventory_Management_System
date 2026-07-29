package com.medistock.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.entity.StockLog;

import com.medistock.demo.repository.MedicineRepository;
import com.medistock.demo.repository.StockLogRepository;



@Service
public class StaffService {



    @Autowired
    private MedicineRepository medicineRepository;



    @Autowired
    private StockLogRepository stockLogRepository;





    @Transactional
    public void updateStock(

            Long id,

            Integer quantity,

            String operation

    ){



        Medicine medicine =

        medicineRepository.findById(id)

        .orElseThrow(
        () -> new RuntimeException(
        "Medicine not found"
        ));





        int oldQty =

        medicine.getQuantity();





        int newQty;



        if(operation.equalsIgnoreCase("ADD")){


            newQty = oldQty + quantity;


        }


        else if(operation.equalsIgnoreCase("REMOVE")){



            if(oldQty < quantity){


                throw new RuntimeException(
                "Insufficient Stock"
                );


            }


            newQty = oldQty - quantity;


        }


        else{


            throw new RuntimeException(
            "Invalid operation"
            );


        }





        medicine.setQuantity(newQty);



        medicineRepository.save(medicine);







        StockLog log = new StockLog();



        log.setMedicine(medicine);



        log.setOperation(operation);



        log.setOldQuantity(oldQty);



        log.setNewQuantity(newQty);



        log.setQuantityChanged(quantity);



        stockLogRepository.save(log);



    }




}