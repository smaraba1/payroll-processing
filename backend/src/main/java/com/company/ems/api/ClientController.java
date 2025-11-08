package com.company.ems.api;

import com.company.ems.api.dto.client.ClientRequest;
import com.company.ems.api.dto.client.ClientResponse;
import com.company.ems.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<Page<ClientResponse>> getAllClients(Pageable pageable) {
        return ResponseEntity.ok(clientService.getAllClients(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Integer id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ClientResponse>> searchClients(
            @RequestParam String name,
            Pageable pageable) {
        return ResponseEntity.ok(clientService.searchClients(name, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.createClient(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable Integer id,
                                                       @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(clientService.updateClient(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClient(@PathVariable Integer id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}

