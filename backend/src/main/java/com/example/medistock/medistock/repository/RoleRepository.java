package com.example.medistock.medistock.repository;



import com.example.medistock.medistock.model.User;
import com.example.medistock.medistock.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}