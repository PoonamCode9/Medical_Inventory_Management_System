package com.medistock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.backend.entity.Role;


public interface RoleRepository extends JpaRepository<Role, Integer> {

}