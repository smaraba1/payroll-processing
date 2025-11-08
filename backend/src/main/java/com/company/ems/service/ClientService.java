package com.company.ems.service;

import com.company.ems.api.dto.client.ClientRequest;
import com.company.ems.api.dto.client.ClientResponse;
import com.company.ems.domain.Client;
import com.company.ems.mapper.ClientMapper;
import com.company.ems.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Transactional(readOnly = true)
    public Page<ClientResponse> getAllClients(Pageable pageable) {
        return clientRepository.findAll(pageable)
                .map(clientMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ClientResponse getClientById(Integer id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));
        return clientMapper.toResponse(client);
    }

    @Transactional(readOnly = true)
    public Page<ClientResponse> searchClients(String name, Pageable pageable) {
        return clientRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(clientMapper::toResponse);
    }

    @Transactional
    public ClientResponse createClient(ClientRequest request) {
        Client client = clientMapper.toEntity(request);
        client = clientRepository.save(client);
        return clientMapper.toResponse(client);
    }

    @Transactional
    public ClientResponse updateClient(Integer id, ClientRequest request) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));

        clientMapper.updateEntity(client, request);
        client = clientRepository.save(client);
        return clientMapper.toResponse(client);
    }

    @Transactional
    public void deleteClient(Integer id) {
        if (!clientRepository.existsById(id)) {
            throw new EntityNotFoundException("Client not found with id: " + id);
        }
        clientRepository.deleteById(id);
    }
}

