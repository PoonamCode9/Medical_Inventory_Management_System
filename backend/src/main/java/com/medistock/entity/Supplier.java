package com.medistock.entity;

import jakarta.persistence.*;

@Entity
@Table(name="suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String supplierName;

    private String contactPerson;

    private String contactNumber;

    private String email;

    private String address;

    private String suppliedMedicines;

    private Integer totalPurchases;

    private Double rating;

    private String status;

    public Supplier() {
    }

    public Supplier(Long id, String supplierName, String contactPerson,
                    String contactNumber, String email, String address,
                    String suppliedMedicines, Integer totalPurchases,
                    Double rating, String status) {

        this.id = id;
        this.supplierName = supplierName;
        this.contactPerson = contactPerson;
        this.contactNumber = contactNumber;
        this.email = email;
        this.address = address;
        this.suppliedMedicines = suppliedMedicines;
        this.totalPurchases = totalPurchases;
        this.rating = rating;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSuppliedMedicines() {
        return suppliedMedicines;
    }

    public void setSuppliedMedicines(String suppliedMedicines) {
        this.suppliedMedicines = suppliedMedicines;
    }

    public Integer getTotalPurchases() {
        return totalPurchases;
    }

    public void setTotalPurchases(Integer totalPurchases) {
        this.totalPurchases = totalPurchases;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}