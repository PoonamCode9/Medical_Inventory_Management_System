package com.medistock.demo.dto;


import com.medistock.demo.entity.Medicine;
import lombok.Data;

import java.util.List;



@Data
public class DashboardResponse {


    // Total medicine types
    private long totalMedicines;



    // Total available quantity
    private long totalStock;



    // Number of suppliers
    private long totalSuppliers;



    // Registered users
    private long totalUsers;



    // Sales module future
    private long salesToday;



    // Low stock count
    private long lowStockCount;



    // Low stock medicine details
    private List<Medicine> lowStockMedicines;



    // Expired medicines count
    private long expiredMedicines;



    // Near expiry count
    private long nearExpiryMedicines;



    // Total inventory value
    private double totalStockValue;


}