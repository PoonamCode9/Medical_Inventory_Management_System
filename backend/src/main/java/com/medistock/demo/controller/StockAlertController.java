package com.medistock.demo.controller;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.service.StockAlertService;

import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/stock-alerts")
@CrossOrigin(origins="http://localhost:3000")
public class StockAlertController {



    private final StockAlertService stockAlertService;




    public StockAlertController(
            StockAlertService stockAlertService
    ){

        this.stockAlertService = stockAlertService;

    }






    @GetMapping("/low-stock")
    public List<Medicine> getLowStock(){


        return stockAlertService.checkLowStock();


    }



}