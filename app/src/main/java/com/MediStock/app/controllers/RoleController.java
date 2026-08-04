package com.MediStock.app.controllers;

import com.MediStock.app.entities.Role;
import com.MediStock.app.services.RoleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // Used by Admin dashboard
    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    // Used by public registration
    @GetMapping("/public")
    public List<Role> getPublicRoles() {
        return roleService.getPublicRoles();
    }
}