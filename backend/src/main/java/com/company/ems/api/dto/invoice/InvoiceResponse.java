package com.company.ems.api.dto.invoice;

import com.company.ems.domain.InvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record InvoiceResponse(
        Integer id,
        Integer clientId,
        String clientName,
        LocalDate issueDate,
        LocalDate dueDate,
        InvoiceStatus status,
        BigDecimal totalAmount,
        BigDecimal amountPaid,
        BigDecimal balanceDue,
        List<InvoiceLineItemResponse> lineItems
) {}

