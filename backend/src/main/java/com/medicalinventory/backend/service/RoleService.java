package com.medicalinventory.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.entity.Role;
import com.medicalinventory.backend.repository.RoleRepository;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    public Role getRoleById(Long id) {
        return roleRepository.findById(id).orElse(null);
    }

    public Role updateRole(Long id, Role role) {
        Role existingRole = roleRepository.findById(id).orElse(null);
        if(existingRole != null) {
            existingRole.setRoleName(role.getRoleName());
            return roleRepository.save(existingRole);
        }
        return null;
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}
