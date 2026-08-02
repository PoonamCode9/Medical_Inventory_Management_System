package com.medistock.demo.controller;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.repository.MedicineRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/admin/stock")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class StockController {



    private final MedicineRepository medicineRepository;



    public StockController(
            MedicineRepository medicineRepository
    ){

        this.medicineRepository = medicineRepository;

    }





    // ==========================================
    // UPDATE STOCK
    // ADMIN ONLY
    // ==========================================


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStock(

            @PathVariable Long id,

            @RequestBody StockRequest request

    ){


        Medicine medicine =
                medicineRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Medicine not found"
                        )
                );



        Integer current =
                medicine.getQuantity();



        if(request.getOperation()
                .equalsIgnoreCase("ADD")){


            medicine.setQuantity(
                    current + request.getQuantity()
            );


        }



        else if(request.getOperation()
                .equalsIgnoreCase("REMOVE")){


            if(current < request.getQuantity()){


                return ResponseEntity
                        .badRequest()
                        .body(
                          "Not enough stock"
                        );


            }


            medicine.setQuantity(
                    current - request.getQuantity()
            );


        }



        medicineRepository.save(medicine);



        return ResponseEntity.ok(
                "Stock updated successfully"
        );


    }






    // ==========================================
    // REQUEST DTO
    // ==========================================


    public static class StockRequest {


        private Integer quantity;


        private String operation;



        public Integer getQuantity(){

            return quantity;

        }



        public void setQuantity(
                Integer quantity
        ){

            this.quantity = quantity;

        }



        public String getOperation(){

            return operation;

        }



        public void setOperation(
                String operation
        ){

            this.operation = operation;

        }


    }


}