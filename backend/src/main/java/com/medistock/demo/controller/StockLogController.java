package com.medistock.demo.controller;


import com.medistock.demo.entity.StockLog;
import com.medistock.demo.service.StockLogService;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api/stock-logs")
@CrossOrigin(origins = "http://localhost:3000")
public class StockLogController {



    private final StockLogService service;



    public StockLogController(
            StockLogService service
    ){

        this.service = service;

    }





    @GetMapping
    public List<StockLog> getLogs(){

        return service.getAllLogs();

    }





    @GetMapping("/medicine/{id}")
    public List<StockLog> getMedicineLogs(
            @PathVariable Long id
    ){

        return service.getMedicineLogs(id);

    }


}