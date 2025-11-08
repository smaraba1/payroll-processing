package com.company.ems.api.dto.client;

public record ClientResponse(
        Integer id,
        String name,
        String contactPerson,
        String contactEmail,
        String address
) {}

