package com.company.ems.api.dto.invoice;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record InvoiceGenerateRequest(
        @NotNull(message = "Client ID is required")
        Integer clientId,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        LocalDate endDate,

        @NotNull(message = "Due date is required")
        LocalDate dueDate
) {}

