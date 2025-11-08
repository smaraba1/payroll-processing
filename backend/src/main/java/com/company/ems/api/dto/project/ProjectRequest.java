package com.company.ems.api.dto.project;

import com.company.ems.domain.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record ProjectRequest(
        @NotBlank(message = "Project name is required")
        String name,

        @NotNull(message = "Client ID is required")
        Integer clientId,

        @NotNull(message = "Default billable rate is required")
        @Positive(message = "Rate must be positive")
        BigDecimal defaultBillableRate,

        ProjectStatus status,

        List<Integer> employeeIds
) {}

