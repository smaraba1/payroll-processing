package com.company.ems.api.dto.invoice;

import java.math.BigDecimal;

public record InvoiceLineItemResponse(
        Integer id,
        Integer projectId,
        String projectName,
        Integer userId,
        String userName,
        String description,
        BigDecimal hours,
        BigDecimal rate,
        BigDecimal lineTotal
) {}

