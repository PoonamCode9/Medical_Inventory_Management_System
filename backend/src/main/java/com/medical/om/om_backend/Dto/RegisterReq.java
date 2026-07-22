package com.medical.om.om_backend.Dto;

// Lombok annotations — automatically generate getters, setters,
// constructors, equals/hashCode at compile time so we don't write boilerplate
import lombok.Getter;
import lombok.Setter;

// We need the Role enum because the client tells us what role the new user should have
import com.medical.om.om_backend.entity.Role;

// @Getter  → Lombok generates: getName(), getUsername(), getPassword(), getRole()
// @Setter  → Lombok generates: setName(), setUsername(), setPassword(), setRole()
// Spring uses these setters internally to fill this object from the incoming JSON body
@Getter
@Setter
public class RegisterReq {

    // The full display name of the user (e.g. "Dr. Smith")
    // This maps to the "name" field in the JSON: { "name": "Dr. Smith", ... }
    private String name;

    // The unique login identifier (e.g. "drsmith")
    // Maps to "username" in JSON
    private String username;

    // The raw password the user types (e.g. "secret123")
    // We will NEVER store this directly — it will be BCrypt-hashed in AuthService
    // Maps to "password" in JSON
    private String password;

    // The role assigned to this user: ADMIN, PHARMACIST, or STAFF
    // Spring automatically converts the string "ADMIN" from JSON into the Role enum
    // Maps to "role" in JSON: { "role": "ADMIN" }
    private Role role;
}
