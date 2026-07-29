package com.medistock.demo.controller;


import com.medistock.demo.entity.ExpiryTracking;
import com.medistock.demo.service.ExpiryTrackingService;


import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/expiry")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class ExpiryTrackingController {



    private final ExpiryTrackingService service;




    public ExpiryTrackingController(
            ExpiryTrackingService service
    ){

        this.service = service;

    }









    // =====================================
    // GET ALL EXPIRY TRACKING
    // GET /api/expiry
    // =====================================


    @GetMapping
    public List<ExpiryTracking> getAll(){


        return service.getAll();


    }









    // =====================================
    // GET EXPIRED MEDICINES
    // GET /api/expiry/expired
    // =====================================


    @GetMapping("/expired")
    public List<ExpiryTracking> expired(){



        return service.getExpired();


    }









    // =====================================
    // GET EXPIRING SOON
    // GET /api/expiry/soon
    // =====================================


    @GetMapping("/soon")
    public List<ExpiryTracking> soon(){



        return service.getExpiringSoon();


    }









    // =====================================
    // GET EXPIRY BY ID
    // GET /api/expiry/{id}
    // =====================================


    @GetMapping("/{id}")
    public ExpiryTracking getById(

            @PathVariable Long id

    ){


        return service.getAll()

                .stream()

                .filter(
                    expiry ->
                    expiry.getId().equals(id)
                )

                .findFirst()

                .orElseThrow(() ->

                        new RuntimeException(
                                "Expiry record not found"
                        )

                );


    }









    // =====================================
    // COUNT EXPIRED
    // GET /api/expiry/count/expired
    // =====================================


    @GetMapping("/count/expired")
    public long expiredCount(){


        return service.getExpired()
                .size();


    }









    // =====================================
    // COUNT EXPIRING SOON
    // GET /api/expiry/count/soon
    // =====================================


    @GetMapping("/count/soon")
    public long soonCount(){


        return service.getExpiringSoon()
                .size();


    }



}