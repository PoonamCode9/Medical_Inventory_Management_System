package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<Users,Long>{
    Optional<Users> findByUsername(String username);
    boolean existsByUsername(String username);
    long count();

    @Query("SELECT u FROM Users u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Users> search(@Param("q") String q);

    @Query("SELECT u FROM Users u WHERE u.role = :role AND u.email IS NOT NULL AND u.email <> ''")
    List<Users> findByRoleWithEmail(@Param("role") com.medical.om.om_backend.entity.Role role);
}
