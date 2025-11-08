package com.company.ems.mapper;

import com.company.ems.api.dto.client.ClientRequest;
import com.company.ems.api.dto.client.ClientResponse;
import com.company.ems.domain.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public ClientResponse toResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getName(),
                client.getContactPerson(),
                client.getContactEmail(),
                client.getAddress()
        );
    }

    public Client toEntity(ClientRequest request) {
        return Client.builder()
                .name(request.name())
                .contactPerson(request.contactPerson())
                .contactEmail(request.contactEmail())
                .address(request.address())
                .build();
    }

    public void updateEntity(Client client, ClientRequest request) {
        client.setName(request.name());
        client.setContactPerson(request.contactPerson());
        client.setContactEmail(request.contactEmail());
        client.setAddress(request.address());
    }
}

