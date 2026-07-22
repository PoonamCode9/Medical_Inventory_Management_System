package com.medical.om.om_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "Medicine")
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false,unique = true)
    private String name;

    @Column(nullable = true)
    private String batch;

    @Column(nullable = true)
    private LocalDate manufacturing_date;

    @Column(nullable = true)
    private LocalDate expiration_date;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Catagories category;

    @Column(length = 1000, nullable = true)
    private String description;

}
