package com.company.ems.api.dto.timesheet;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record TimesheetRequest(
        @NotNull(message = "Week start date is required")
        LocalDate weekStartDate,

        @Valid
        List<TimeEntryRequest> timeEntries
) {}

