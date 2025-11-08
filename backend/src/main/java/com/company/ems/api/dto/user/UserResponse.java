package com.company.ems.api.dto.user;

import com.company.ems.domain.UserRole;

import java.time.LocalDate;

public record UserResponse(
        Integer id,
        String email,
        String firstName,
        String lastName,
        String fullName,
        UserRole role,
        Integer managerId,
        String managerName,
        String department,
        String jobTitle,
        LocalDate hireDate,
        Boolean isActive
) {}

