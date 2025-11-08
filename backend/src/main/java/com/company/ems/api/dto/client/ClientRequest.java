package com.company.ems.api.dto.client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClientRequest(
        @NotBlank(message = "Client name is required")
        String name,

        String contactPerson,

        @Email(message = "Contact email must be valid")
        String contactEmail,

        String address
) {}

