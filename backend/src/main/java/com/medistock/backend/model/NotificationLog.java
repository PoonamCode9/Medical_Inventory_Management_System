package com.medistock.backend.model;

import jakarta.persistence.*;

import java.time.LocalDate;

/**
 * Records that an expiry alert email was already sent for a given medicine,
 * on a given day, of a given type. The scheduler checks this before sending
 * so the same medicine doesn't trigger a fresh email every single run.
 */
@Entity
@Table(
    name = "notification_logs",
    uniqueConstraints = @UniqueConstraint(columnNames = {"medicine_id", "sent_date", "type"})
)
public class NotificationLog {

    public enum Type { EXPIRED, CRITICAL, NEAR_EXPIRY }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "medicine_id", nullable = false)
    private Long medicineId;

    @Column(name = "sent_date", nullable = false)
    private LocalDate sentDate;

    @Enumerated(EnumType.STRING)
    private Type type;

    public NotificationLog() {}

    public NotificationLog(Long medicineId, LocalDate sentDate, Type type) {
        this.medicineId = medicineId;
        this.sentDate = sentDate;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMedicineId() { return medicineId; }
    public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }

    public LocalDate getSentDate() { return sentDate; }
    public void setSentDate(LocalDate sentDate) { this.sentDate = sentDate; }

    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
}
