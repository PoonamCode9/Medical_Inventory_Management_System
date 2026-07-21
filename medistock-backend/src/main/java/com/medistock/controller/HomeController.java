package com.medistock.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to MediStock Backend";
    }

    @GetMapping("/api/test")
    public String test() {
        return "MediStock API is Working Successfully!";
    }
}