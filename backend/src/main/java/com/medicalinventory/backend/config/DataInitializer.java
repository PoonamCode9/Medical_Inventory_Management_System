package com.medicalinventory.backend.config;

import com.medicalinventory.backend.entity.Role;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.RoleRepository;
import com.medicalinventory.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, 
                           UserRepository userRepository, 
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        createRoleIfNotFound("Admin");
        createRoleIfNotFound("Pharmacist");
        createRoleIfNotFound("Staff");

        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = new User();
            admin.setFullName("Super Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("9876543210");
            
            Role adminRole = roleRepository.findByRoleName("Admin")
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));
            admin.setRole(adminRole);
            
            userRepository.save(admin);
            System.out.println("Default Admin Account Created Successfully!");
        }
    }

    private void createRoleIfNotFound(String roleName) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            Role role = new Role();
            role.setRoleName(roleName);
            roleRepository.save(role);
        }
    }
}