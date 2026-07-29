package com.medistock.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // IMPORTANT: enforce consistency
    @Column(name = "role_name", unique = true, nullable = false)
    private String roleName;

    // OPTIONAL (but strongly recommended)
    public String getRoleName() {
        return roleName == null ? null : roleName.toUpperCase();
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName == null ? null : roleName.toUpperCase();
    }
}