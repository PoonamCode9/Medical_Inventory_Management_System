package com.medistock.demo.entity;


import jakarta.persistence.*;

import java.time.LocalDate;



@Entity
@Table(name = "expiry_tracking")
public class ExpiryTracking {



    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;





    // =====================================
    // MEDICINE RELATIONSHIP
    // =====================================


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "medicine_id",
            nullable = false,
            unique = true
    )
    private Medicine medicine;






    // =====================================
    // EXPIRY DATE
    // =====================================


    @Column(
            name = "expiry_date",
            nullable = false
    )
    private LocalDate expiryDate;






    // =====================================
    // DAYS REMAINING
    // =====================================


    @Column(
            name = "days_remaining"
    )
    private Integer daysRemaining;






    // =====================================
    // STATUS
    // ACTIVE
    // EXPIRING_SOON
    // EXPIRED
    // =====================================


    @Column(
            nullable = false
    )
    private String status = "ACTIVE";







    // =====================================
    // NOTIFICATION STATUS
    // =====================================


    @Column(
            name = "notification_sent"
    )
    private Boolean notificationSent = false;








    // =====================================
    // CONSTRUCTORS
    // =====================================


    public ExpiryTracking(){

    }







    public ExpiryTracking(
            Medicine medicine,
            LocalDate expiryDate
    ){

        this.medicine = medicine;

        this.expiryDate = expiryDate;

        this.status = "ACTIVE";

        this.notificationSent = false;

    }








    // =====================================
    // GETTERS AND SETTERS
    // =====================================


    public Long getId(){

        return id;

    }



    public void setId(Long id){

        this.id = id;

    }






    public Medicine getMedicine(){

        return medicine;

    }



    public void setMedicine(Medicine medicine){

        this.medicine = medicine;

    }






    public LocalDate getExpiryDate(){

        return expiryDate;

    }



    public void setExpiryDate(LocalDate expiryDate){

        this.expiryDate = expiryDate;

    }






    public Integer getDaysRemaining(){

        return daysRemaining;

    }



    public void setDaysRemaining(Integer daysRemaining){

        this.daysRemaining = daysRemaining;

    }






    public String getStatus(){

        return status;

    }



    public void setStatus(String status){

        this.status = status;

    }






    public Boolean getNotificationSent(){

        return notificationSent;

    }



    public void setNotificationSent(Boolean notificationSent){

        this.notificationSent = notificationSent;

    }

}