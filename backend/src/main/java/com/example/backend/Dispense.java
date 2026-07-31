package com.example.backend;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "dispenses")
public class Dispense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "dispensed_by", nullable = false)
    private User dispensedBy;

    @Column(name = "remarks", length = 1000)
    private String remarks;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }


    public Dispense() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getDispensedBy() {
        return dispensedBy;
    }

    public void setDispensedBy(User dispensedBy) {
        this.dispensedBy = dispensedBy;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

