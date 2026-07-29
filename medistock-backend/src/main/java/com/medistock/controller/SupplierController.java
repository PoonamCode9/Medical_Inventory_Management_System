package com.medistock.controller;

import com.medistock.entity.Supplier;
import com.medistock.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin("*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier){
        return supplierService.addSupplier(supplier);
    }

    @GetMapping
    public List<Supplier> getAllSuppliers(){
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/{id}")
    public Supplier getSupplier(@PathVariable Long id){
        return supplierService.getSupplier(id);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id,
                                   @RequestBody Supplier supplier){
        return supplierService.updateSupplier(id, supplier);
    }

    @DeleteMapping("/{id}")
    public String deleteSupplier(@PathVariable Long id){
        supplierService.deleteSupplier(id);
        return "Supplier Deleted Successfully";
    }

    @GetMapping("/search")
    public List<Supplier> searchSupplier(@RequestParam String name){
        return supplierService.searchSupplier(name);
    }

}