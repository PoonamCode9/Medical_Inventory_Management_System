package com.MediStock.app.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Welcome Admin!";
    }

    @GetMapping("/api/staff")
    @PreAuthorize("hasRole('STAFF')")
    public String staffAccess() {
        return "Welcome Staff!";
    }

    @GetMapping("/api/pharmacist")
    @PreAuthorize("hasRole('PHARMACIST')")
    public String pharmacistAccess() {
        return "Welcome Pharmacist!";
    }
}