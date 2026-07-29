package com.medistock.demo.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;



@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {



    // ==============================
    // PRIMARY KEY
    // ==============================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;





    // ==============================
    // USERNAME
    // ==============================

    @Column(
            nullable = false,
            unique = true
    )
    private String username;





    // ==============================
    // EMAIL
    // ==============================

    @Column(
            unique = true
    )
    private String email;





    // ==============================
    // PHONE
    // ==============================

    @Column(
            nullable = false,
            unique = true
    )
    private String phone;





    // ==============================
    // PASSWORD
    // ==============================

    /*
       BCrypt encrypted password
       Example:
       $2a$10$xxxxxxxxxxxxxxxxxxxx
    */

    @JsonIgnore
    @Column(
            nullable = false,
            length = 255
    )
    private String password;





    // ==============================
    // FULL NAME
    // ==============================

    @Column(
            name = "full_name"
    )
    private String fullName;





    // ==============================
    // OTP
    // ==============================

    @Column
    private String otp;





    // ==============================
    // ROLE
    // ADMIN
    // PHARMACIST
    // STAFF
    // ==============================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "role_id",
            nullable = false
    )
    private Role role;





    // ==============================
    // CREATED DATE
    // ==============================

    @Column(
            name = "created_at",
            updatable = false
    )
    private LocalDateTime createdAt;





    // ==============================
    // BEFORE SAVE
    // ==============================

    @PrePersist
    public void prePersist(){

        if(createdAt == null){

            createdAt = LocalDateTime.now();

        }

    }



}