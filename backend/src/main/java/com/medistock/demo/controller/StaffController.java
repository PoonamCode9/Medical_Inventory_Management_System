package com.medistock.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.medistock.demo.dto.StockUpdateRequest;
import com.medistock.demo.service.StaffService;



@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffController {



    @Autowired
    private StaffService staffService;



    @PutMapping("/stock/update/{id}")
    public String updateStock(

            @PathVariable Long id,

            @RequestBody StockUpdateRequest request

    ){


        staffService.updateStock(

                id,

                request.getQuantity(),

                request.getOperation()

        );


        return "Stock Updated Successfully";


    }



}