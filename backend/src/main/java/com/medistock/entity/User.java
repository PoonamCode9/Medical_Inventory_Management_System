package com.medistock.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.Date;


@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String resetToken;

private Date resetTokenExpiry;

    @Column(unique = true)
    private String email;
@JsonIgnore
    private String password;

 @ManyToOne
@JoinColumn(name = "role_id")
private Role role;
    

    public User() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    public String getResetToken() {
    return resetToken;
}

public void setResetToken(String resetToken) {
    this.resetToken = resetToken;
}

public Date getResetTokenExpiry() {
    return resetTokenExpiry;
}

public void setResetTokenExpiry(Date resetTokenExpiry) {
    this.resetTokenExpiry = resetTokenExpiry;
}
}