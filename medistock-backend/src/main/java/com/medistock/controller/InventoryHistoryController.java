package com.medistock.controller;

import com.medistock.entity.InventoryHistory;
import com.medistock.service.InventoryHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin("*")
public class InventoryHistoryController {

    @Autowired
    private InventoryHistoryService service;

    @GetMapping
    public List<InventoryHistory> getHistory(){

        return service.getHistory();

    }

}