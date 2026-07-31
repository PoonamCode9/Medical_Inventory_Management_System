package com.example.backend;

import com.example.backend.dto.CreateTaskRequest;
import com.example.backend.dto.TaskDto;
import com.example.backend.dto.UpdateTaskRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationIntegrationService notificationIntegrationService;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository,
                          NotificationIntegrationService notificationIntegrationService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationIntegrationService = notificationIntegrationService;
    }

    // ─── Helper ──────────────────────────────────────────────

    private String extractEmail(Authentication auth) {
        return auth.getName();
    }

    private User findCurrentUser(Authentication auth) {
        String email = extractEmail(auth);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setTaskId(task.getTaskId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setAssignedToId(task.getAssignedTo().getId());
        dto.setAssignedToName(task.getAssignedTo().getName());
        dto.setCreatedById(task.getCreatedBy().getId());
        dto.setCreatedByName(task.getCreatedBy().getName());
        dto.setRelatedPurchaseOrderId(task.getRelatedPurchaseOrderId());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setCompletedAt(task.getCompletedAt());
        return dto;
    }

    private List<TaskDto> toDtoList(List<Task> tasks) {
        return tasks.stream().map(this::toDto).collect(Collectors.toList());
    }

    // ─── Admin Endpoints ─────────────────────────────────────

    @GetMapping("/api/admin/tasks")
    public ResponseEntity<List<TaskDto>> adminGetTasks() {
        List<Task> tasks = taskRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(toDtoList(tasks));
    }

    @GetMapping("/api/admin/tasks/{id}")
    public ResponseEntity<TaskDto> adminGetTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return ResponseEntity.ok(toDto(task));
    }

    @PostMapping("/api/admin/tasks")
    public ResponseEntity<TaskDto> adminCreateTask(@RequestBody CreateTaskRequest req,
                                                    Authentication auth) {
        User currentUser = findCurrentUser(auth);
        User assignedUser = userRepository.findById(req.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        Task task = new Task();
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setAssignedTo(assignedUser);
        task.setCreatedBy(currentUser);
        task.setRelatedPurchaseOrderId(req.getRelatedPurchaseOrderId());
        task.setPriority(req.getPriority() != null ? req.getPriority() : "MEDIUM");
        task.setStatus("PENDING");
        task.setDueDate(req.getDueDate());
        task.setCreatedAt(LocalDateTime.now());

        Task saved = taskRepository.save(task);

        // Notify assigned user and creator about the new task
        notificationIntegrationService.notifyTaskAssigned(
                assignedUser.getId(), currentUser.getId(), saved.getTitle(), saved.getTaskId());

        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/api/admin/tasks/{id}")
    public ResponseEntity<TaskDto> adminUpdateTask(@PathVariable Long id,
                                                    @RequestBody UpdateTaskRequest req) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if ("COMPLETED".equals(task.getStatus())) {
            throw new RuntimeException("Cannot edit a completed task");
        }

        if (req.getTitle() != null) task.setTitle(req.getTitle());
        if (req.getDescription() != null) task.setDescription(req.getDescription());
        if (req.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(req.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignedUser);
        }
        if (req.getPriority() != null) task.setPriority(req.getPriority());
        if (req.getDueDate() != null) task.setDueDate(req.getDueDate());
        if (req.getRelatedPurchaseOrderId() != null) task.setRelatedPurchaseOrderId(req.getRelatedPurchaseOrderId());

        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/api/admin/tasks/{id}")
    public ResponseEntity<Map<String, String>> adminDeleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Task deleted successfully");
        return ResponseEntity.ok(resp);
    }

    // ─── Pharmacist Endpoints ────────────────────────────────

    @GetMapping("/api/pharmacist/tasks")
    public ResponseEntity<List<TaskDto>> pharmacistGetTasks() {
        List<Task> tasks = taskRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(toDtoList(tasks));
    }

    @GetMapping("/api/pharmacist/tasks/{id}")
    public ResponseEntity<TaskDto> pharmacistGetTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return ResponseEntity.ok(toDto(task));
    }

    @PostMapping("/api/pharmacist/tasks")
    public ResponseEntity<TaskDto> pharmacistCreateTask(@RequestBody CreateTaskRequest req,
                                                         Authentication auth) {
        User currentUser = findCurrentUser(auth);
        User assignedUser = userRepository.findById(req.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        Task task = new Task();
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setAssignedTo(assignedUser);
        task.setCreatedBy(currentUser);
        task.setRelatedPurchaseOrderId(req.getRelatedPurchaseOrderId());
        task.setPriority(req.getPriority() != null ? req.getPriority() : "MEDIUM");
        task.setStatus("PENDING");
        task.setDueDate(req.getDueDate());
        task.setCreatedAt(LocalDateTime.now());

        Task saved = taskRepository.save(task);

        // Notify assigned user and creator about the new task
        notificationIntegrationService.notifyTaskAssigned(
                assignedUser.getId(), currentUser.getId(), saved.getTitle(), saved.getTaskId());

        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/api/pharmacist/tasks/{id}")
    public ResponseEntity<TaskDto> pharmacistUpdateTask(@PathVariable Long id,
                                                         @RequestBody UpdateTaskRequest req) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if ("COMPLETED".equals(task.getStatus())) {
            throw new RuntimeException("Cannot edit a completed task");
        }

        if (req.getTitle() != null) task.setTitle(req.getTitle());
        if (req.getDescription() != null) task.setDescription(req.getDescription());
        if (req.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(req.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignedUser);
        }
        if (req.getPriority() != null) task.setPriority(req.getPriority());
        if (req.getDueDate() != null) task.setDueDate(req.getDueDate());
        if (req.getRelatedPurchaseOrderId() != null) task.setRelatedPurchaseOrderId(req.getRelatedPurchaseOrderId());

        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/api/pharmacist/tasks/{id}")
    public ResponseEntity<Map<String, String>> pharmacistDeleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Task deleted successfully");
        return ResponseEntity.ok(resp);
    }

    // ─── Staff Endpoints ─────────────────────────────────────

    @GetMapping("/api/staff/tasks")
    public ResponseEntity<List<TaskDto>> staffGetMyTasks(
            Authentication auth) {
        User currentUser = findCurrentUser(auth);
        List<Task> tasks = taskRepository.findByAssignedToIdOrderByCreatedAtDesc(currentUser.getId());
        return ResponseEntity.ok(toDtoList(tasks));
    }

    @GetMapping("/api/staff/tasks/counts")
    public ResponseEntity<Map<String, Long>> staffGetTaskCounts(Authentication auth) {
        User currentUser = findCurrentUser(auth);
        long pending = taskRepository.countByAssignedToIdAndStatus(currentUser.getId(), "PENDING");
        long completed = taskRepository.countByAssignedToIdAndStatus(currentUser.getId(), "COMPLETED");
        Map<String, Long> counts = new HashMap<>();
        counts.put("pending", pending);
        counts.put("completed", completed);
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/api/staff/tasks/{id}")
    public ResponseEntity<TaskDto> staffGetTask(@PathVariable Long id, Authentication auth) {
        User currentUser = findCurrentUser(auth);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getAssignedTo().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: This task is not assigned to you");
        }
        return ResponseEntity.ok(toDto(task));
    }

    @PutMapping("/api/staff/tasks/{id}/complete")
    public ResponseEntity<TaskDto> staffCompleteTask(@PathVariable Long id, Authentication auth) {
        User currentUser = findCurrentUser(auth);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getAssignedTo().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: This task is not assigned to you");
        }

        if ("COMPLETED".equals(task.getStatus())) {
            throw new RuntimeException("Task is already completed");
        }

        task.setStatus("COMPLETED");
        task.setCompletedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);

        // Notify creator that task is completed
        notificationIntegrationService.notifyTaskCompleted(
                currentUser.getId(), task.getCreatedBy().getId(), saved.getTitle(), saved.getTaskId());

        return ResponseEntity.ok(toDto(saved));
    }

    // ─── Fetch Staff users (for dropdown) ────────────────────

    @GetMapping("/api/admin/users/staff")
    public ResponseEntity<List<Map<String, Object>>> getStaffUsers() {
        List<User> staffUsers = userRepository.findAll().stream()
                .filter(u -> "Staff".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());

        List<Map<String, Object>> result = staffUsers.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/pharmacist/users/staff")
    public ResponseEntity<List<Map<String, Object>>> getStaffUsersPharmacist() {
        List<User> staffUsers = userRepository.findAll().stream()
                .filter(u -> "Staff".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());

        List<Map<String, Object>> result = staffUsers.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}

