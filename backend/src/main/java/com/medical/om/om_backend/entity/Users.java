package com.medical.om.om_backend.entity;

import jakarta.persistence.*;
import lombok.Getter; // Generates getters for all fields: getId(), getName(), getUsername(), etc.
import lombok.Setter; // Generates setters for all fields: setName(), setPassword(), etc.
                      // We need setters in AuthService when building a new Users object to save

// @Getter — without this, user.getPassword() / user.getUsername() / user.getRole()
//           would not exist and the code won't compile
// @Setter — without this, we can't set fields when creating a new user during registration
@Getter
@Setter
@Entity                    // Marks this class as a JPA entity (maps to a DB table)
@Table(name = "Users")     // The actual table name in PostgreSQL
public class Users {

    @Id                                                    // This is the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)    // Auto-increment (SERIAL in Postgres)
    private long id;

    @Column(unique = true, nullable = false)   // Name must be unique and not null in the DB
    private String name;

    @Enumerated(EnumType.STRING)   // Store the enum as a STRING ("ADMIN") not a number (0)
    @Column(nullable = false)
    private Role role;

    @Column(unique = true, nullable = false)   // Username must be unique — used for login
    private String username;

    @Column(nullable = false)   // Password field — will store the BCrypt hash, never raw text
    private String password;
}
