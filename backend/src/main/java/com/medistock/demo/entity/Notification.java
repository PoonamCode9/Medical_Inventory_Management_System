package com.medistock.demo.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Table(name = "notifications")
@Data
public class Notification {


    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;



    // ===============================
    // USER ID
    // ===============================

    @Column(name = "user_id")
    private Long userId;





    // ===============================
    // TITLE
    // ===============================

    @Column(
            length = 200,
            nullable = false
    )
    private String title;





    // ===============================
    // MESSAGE
    // ===============================

    @Column(
            columnDefinition = "TEXT",
            nullable = false
    )
    private String message;





    // ===============================
    // NOTIFICATION TYPE
    // LOW_STOCK / EXPIRY / SYSTEM
    // ===============================

    @Column(
            name = "notification_type",
            nullable = false
    )
    private String notificationType;





    // ===============================
    // OLD TYPE COLUMN
    // ===============================

    @Column(name = "type")
    private String type;





    // ===============================
    // RECEIVER ROLE
    // ADMIN / PHARMACIST / STAFF
    // ===============================

    @Column(name = "receiver_role")
    private String receiverRole;





    // ===============================
    // READ STATUS
    // false = UNREAD
    // true  = READ
    // ===============================

    @Column(
            name = "is_read",
            nullable = false
    )
    private boolean isRead = false;





    // ===============================
    // CREATED TIME
    // ===============================

    @Column(name = "created_at")
    private LocalDateTime createdAt;





    // ===============================
    // BEFORE INSERT
    // ===============================

    @PrePersist
    public void onCreate(){

        if(createdAt == null){

            createdAt = LocalDateTime.now();

        }

    }





    // ===============================
    // BOOLEAN GETTER / SETTER
    // ===============================

    public boolean getIsRead(){

        return isRead;

    }



    public void setIsRead(boolean read){

        this.isRead = read;

    }


}