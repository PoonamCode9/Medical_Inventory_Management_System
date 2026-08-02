package com.medistock.demo.repository;


import com.medistock.demo.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;



public interface UserRepository 
        extends JpaRepository<User, Long> {




    // =====================================
    // LOGIN USING EMAIL
    // =====================================

    Optional<User> findByEmail(String email);

 List<User> findAllByOrderByIdAsc();


    // =====================================
    // OTP LOGIN USING PHONE NUMBER
    // =====================================

    Optional<User> findByPhone(String phone);




    // =====================================
    // ADMIN USER MANAGEMENT
    // CHECK DUPLICATE USERNAME
    // =====================================

    Optional<User> findByUsername(String username);




    // =====================================
    // CHECK DUPLICATE EMAIL
    // =====================================

    boolean existsByEmail(String email);




    // =====================================
    // CHECK DUPLICATE PHONE
    // =====================================

    boolean existsByPhone(String phone);




    // =====================================
    // CHECK DUPLICATE USERNAME
    // =====================================

    boolean existsByUsername(String username);



}