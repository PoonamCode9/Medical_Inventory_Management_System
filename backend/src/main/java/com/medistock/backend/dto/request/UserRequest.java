package com.medistock.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {

    @NotBlank(message = "Full Name is required")
    @Size(min = 3, max = 60, message = "Full Name must be between 3 and 60 characters")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Name can only contain alphabets and spaces")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must contain exactly 10 digits")
    private String phone;

    private String password; // Validated conditionally in service flow (required for create, optional for update)

    @NotNull(message = "Role ID is required")
    private Integer roleId;

    private Boolean status;
}
