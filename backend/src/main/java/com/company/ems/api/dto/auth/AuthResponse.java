package com.company.ems.api.dto.auth;

import com.company.ems.domain.UserRole;

public record AuthResponse(
        String token,
        String email,
        String firstName,
        String lastName,
        UserRole role,
        Integer userId
) {}

