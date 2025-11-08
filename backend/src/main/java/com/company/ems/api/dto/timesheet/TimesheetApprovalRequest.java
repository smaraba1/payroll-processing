package com.company.ems.api.dto.timesheet;

import jakarta.validation.constraints.NotNull;

public record TimesheetApprovalRequest(
        @NotNull(message = "Approved flag is required")
        Boolean approved,

        String comments
) {}

