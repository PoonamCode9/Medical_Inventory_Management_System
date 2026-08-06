package com.medistock.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="inventory_history")
public class InventoryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicineName;

    private String action;

    private int quantity;

    private LocalDateTime actionTime;

    public InventoryHistory(){}

    public InventoryHistory(String medicineName,
                            String action,
                            int quantity,
                            LocalDateTime actionTime){
        this.medicineName=medicineName;
        this.action=action;
        this.quantity=quantity;
        this.actionTime=actionTime;
    }

    public Long getId(){ return id; }

    public void setId(Long id){ this.id=id; }

    public String getMedicineName(){ return medicineName; }

    public void setMedicineName(String medicineName){
        this.medicineName=medicineName;
    }

    public String getAction(){ return action; }

    public void setAction(String action){
        this.action=action;
    }

    public int getQuantity(){ return quantity; }

    public void setQuantity(int quantity){
        this.quantity=quantity;
    }

    public LocalDateTime getActionTime(){
        return actionTime;
    }

    public void setActionTime(LocalDateTime actionTime){
        this.actionTime=actionTime;
    }
}