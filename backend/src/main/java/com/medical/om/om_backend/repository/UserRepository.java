package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users,Long>{
    Optional<Users> findByUsername(String username);
    boolean existsByUsername(String username);
    long count();
}
