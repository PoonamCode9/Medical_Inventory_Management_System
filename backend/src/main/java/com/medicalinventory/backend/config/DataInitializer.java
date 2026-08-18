package com.medicalinventory.backend.config;

import com.medicalinventory.backend.entity.Role;
import com.medicalinventory.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        createRoleIfNotFound("Admin");
        createRoleIfNotFound("Pharmacist");
        createRoleIfNotFound("Staff");
    }

    private void createRoleIfNotFound(String roleName) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            Role role = new Role();
            role.setRoleName(roleName);
            roleRepository.save(role);
        }
    }
}