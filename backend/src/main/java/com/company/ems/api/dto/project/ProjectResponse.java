package com.company.ems.api.dto.project;

import com.company.ems.domain.ProjectStatus;

import java.math.BigDecimal;

public record ProjectResponse(
        Integer id,
        String name,
        Integer clientId,
        String clientName,
        BigDecimal defaultBillableRate,
        ProjectStatus status
) {}

