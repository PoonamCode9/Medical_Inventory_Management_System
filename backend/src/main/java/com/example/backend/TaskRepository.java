package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedToIdOrderByCreatedAtDesc(Integer userId);

    List<Task> findByCreatedByIdOrderByCreatedAtDesc(Integer userId);

    List<Task> findAllByOrderByCreatedAtDesc();

    long countByAssignedToIdAndStatus(Integer userId, String status);


}

