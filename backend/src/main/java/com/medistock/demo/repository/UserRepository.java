package com.medistock.demo.repository;


import com.medistock.demo.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;



public interface UserRepository 
        extends JpaRepository<User, Long> {



    // =====================================================
    // LOGIN USING EMAIL
    // =====================================================

    Optional<User> findByEmail(
            String email
    );





    // =====================================================
    // ADMIN USER MANAGEMENT
    // =====================================================

    List<User> findAllByOrderByIdAsc();





    // =====================================================
    // OTP LOGIN USING PHONE NUMBER
    // =====================================================

    Optional<User> findByPhone(
            String phone
    );





    // =====================================================
    // USERNAME SEARCH
    // =====================================================

    Optional<User> findByUsername(
            String username
    );





    // =====================================================
    // DUPLICATE EMAIL
    // =====================================================

    boolean existsByEmail(
            String email
    );





    // =====================================================
    // DUPLICATE PHONE
    // =====================================================

    boolean existsByPhone(
            String phone
    );





    // =====================================================
    // DUPLICATE USERNAME
    // =====================================================

    boolean existsByUsername(
            String username
    );





    // =====================================================
    // EMAIL ALERT USERS
    // ADMIN + PHARMACIST
    //
    // User entity:
    // User -> Role
    // Role -> roleName
    //
    // Correct JPA path:
    // role.roleName
    // =====================================================


    List<User> findByRoleRoleName(
            String roleName
    );



}