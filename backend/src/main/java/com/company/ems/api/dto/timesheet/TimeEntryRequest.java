package com.company.ems.api.dto.timesheet;

import com.company.ems.domain.TaskType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TimeEntryRequest(
        Integer id,

        Integer projectId,

        @NotNull(message = "Entry date is required")
        LocalDate entryDate,

        @NotNull(message = "Hours is required")
        @Positive(message = "Hours must be positive")
        BigDecimal hours,

        @NotNull(message = "Task type is required")
        TaskType taskType,

        String notes
) {}

