package com.medistock.demo.controller;

import com.medistock.demo.dto.MultiSaleRequest;
import com.medistock.demo.dto.SaleRequest;
import com.medistock.demo.entity.Sale;
import com.medistock.demo.entity.User;
import com.medistock.demo.repository.UserRepository;
import com.medistock.demo.service.SalePdfService;
import com.medistock.demo.service.SaleService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/sales")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class SaleController {


    private final SaleService saleService;

    private final SalePdfService salePdfService;

    private final UserRepository userRepository;


    public SaleController(

            SaleService saleService,

            SalePdfService salePdfService,

            UserRepository userRepository

    ) {

        this.saleService =
                saleService;

        this.salePdfService =
                salePdfService;

        this.userRepository =
                userRepository;

    }


    // =====================================================
    // SELL SINGLE
    // =====================================================

    @PostMapping("/sell/{userId}")
    public Sale sell(

            @PathVariable Long userId,

            @RequestBody SaleRequest request

    ) {

        return saleService.sellMedicine(

                request,

                userId

        );

    }


    // =====================================================
    // SELL MULTIPLE
    // =====================================================

    @PostMapping("/sell-multiple/{userId}")
    public List<Sale> sellMultiple(

            @PathVariable Long userId,

            @RequestBody MultiSaleRequest request

    ) {

        return saleService.sellMultipleMedicines(

                request.getMedicines(),

                userId

        );

    }


    // =====================================================
    // ALL SALES
    // =====================================================

    @GetMapping
    public List<Sale> getAllSales() {

        return saleService.getAllSales();

    }


    // =====================================================
    // SALES BY USER
    // =====================================================

    @GetMapping("/user/{userId}")
    public List<Sale> getUserSales(

            @PathVariable Long userId

    ) {

        return saleService.history(userId);

    }


    // =====================================================
    // DOWNLOAD LOGGED-IN USER SALES PDF
    // =====================================================

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadSalesPdf(

            Authentication authentication

    ) {

        try {


            // =============================================
            // CHECK AUTHENTICATION
            // =============================================

            if (authentication == null) {

                return ResponseEntity
                        .status(401)
                        .build();

            }


            // =============================================
            // GET LOGGED-IN USER EMAIL
            // =============================================

            String email =
                    authentication.getName();


            System.out.println(
                    "PDF requested by: "
                            + email
            );


            // =============================================
            // FIND USER
            // =============================================

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "Logged-in user not found"
                                            )
                            );


            System.out.println(
                    "Generating PDF for user ID: "
                            + user.getId()
            );


            // =============================================
            // GENERATE USER SALES PDF
            // =============================================

            byte[] pdf =
                    salePdfService.generateSalesPdf(
                            user.getId()
                    );


            // =============================================
            // RESPONSE
            // =============================================

            return ResponseEntity
                    .ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"sales-history.pdf\""
                    )
                    .contentType(
                            MediaType.APPLICATION_PDF
                    )
                    .contentLength(
                            pdf.length
                    )
                    .body(pdf);


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();

        }

    }

}