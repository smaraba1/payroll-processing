package com.company.ems.api.dto.user;

import com.company.ems.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UserRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        String password,

        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotNull(message = "Role is required")
        UserRole role,

        Integer managerId,

        String department,

        String jobTitle,

        LocalDate hireDate,

        Boolean isActive
) {}

