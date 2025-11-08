package com.company.ems.api.dto.timesheet;

import com.company.ems.domain.TimesheetStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TimesheetResponse(
        Integer id,
        Integer userId,
        String userName,
        LocalDate weekStartDate,
        TimesheetStatus status,
        LocalDateTime submittedAt,
        LocalDateTime approvedAt,
        String rejectionComments,
        List<TimeEntryResponse> timeEntries,
        BigDecimal totalHours
) {}

