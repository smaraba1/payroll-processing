package com.company.ems.api.dto.invoice;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentRequest(
        @NotNull(message = "Payment date is required")
        LocalDate paymentDate,

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        BigDecimal amount,

        String method,

        String notes
) {}

