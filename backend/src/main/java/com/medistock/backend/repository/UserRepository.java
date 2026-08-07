package com.medistock.backend.repository;

import com.medistock.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);

    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE r.roleName IN ('ADMIN', 'PHARMACIST')")
    long countAdminsAndPharmacists();
}
