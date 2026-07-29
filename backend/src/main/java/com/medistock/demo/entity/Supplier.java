package com.medistock.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
public class Supplier {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "supplier_name", nullable = false)
    private String name;


    @Column(name = "contact_number")
    private String contact;


    private String email;


    private String address;

}