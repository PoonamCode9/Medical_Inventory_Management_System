package com.MediStock.app.services;

import com.MediStock.app.entities.Role;
import com.MediStock.app.repositories.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Returns all roles (Admin use)
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // Returns only Staff and Pharmacist (Public registration)
    public List<Role> getPublicRoles() {

        return roleRepository.findAll()
                .stream()
                .filter(role -> !role.getRoleName().equalsIgnoreCase("ADMIN"))
                .collect(Collectors.toList());
    }
}