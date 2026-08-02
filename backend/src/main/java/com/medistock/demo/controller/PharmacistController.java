package com.medistock.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.medistock.demo.dto.SaleRequest;
import com.medistock.demo.service.PharmacistService;



@RestController
@RequestMapping("/api/pharmacist")
@CrossOrigin
public class PharmacistController {



@Autowired
private PharmacistService pharmacistService;



@PostMapping("/sale")
public String sellMedicine(

@RequestBody SaleRequest request

){



pharmacistService.sellMedicine(

request.getMedicineId(),

request.getQuantity()

);



return "Medicine Sold Successfully";


}



}