package com.company.ems.api.dto.invoice;

import com.company.ems.domain.InvoiceStatus;
import jakarta.validation.constraints.NotNull;

public record InvoiceStatusUpdateRequest(
        @NotNull(message = "Status is required")
        InvoiceStatus status
) {}

