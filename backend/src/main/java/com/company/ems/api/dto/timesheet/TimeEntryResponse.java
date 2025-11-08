package com.company.ems.api.dto.timesheet;

import com.company.ems.domain.TaskType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TimeEntryResponse(
        Integer id,
        Integer projectId,
        String projectName,
        String clientName,
        LocalDate entryDate,
        BigDecimal hours,
        TaskType taskType,
        String notes
) {}

