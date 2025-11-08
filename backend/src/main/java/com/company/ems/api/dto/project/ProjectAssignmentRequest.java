package com.company.ems.api.dto.project;

import jakarta.validation.constraints.NotNull;

public record ProjectAssignmentRequest(
        @NotNull(message = "User ID is required")
        Integer userId,

        @NotNull(message = "Project ID is required")
        Integer projectId
) {}

