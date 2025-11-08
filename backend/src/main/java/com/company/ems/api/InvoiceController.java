package com.company.ems.api;

import com.company.ems.api.dto.invoice.InvoiceGenerateRequest;
import com.company.ems.api.dto.invoice.InvoiceResponse;
import com.company.ems.api.dto.invoice.InvoiceStatusUpdateRequest;
import com.company.ems.api.dto.invoice.PaymentRequest;
import com.company.ems.domain.InvoiceStatus;
import com.company.ems.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<Page<InvoiceResponse>> getAllInvoices(Pageable pageable) {
        return ResponseEntity.ok(invoiceService.getAllInvoices(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable Integer id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<Page<InvoiceResponse>> getInvoicesByClientId(
            @PathVariable Integer clientId,
            Pageable pageable) {
        return ResponseEntity.ok(invoiceService.getInvoicesByClientId(clientId, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<InvoiceResponse>> searchInvoices(
            @RequestParam(required = false) Integer clientId,
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        return ResponseEntity.ok(invoiceService.getInvoicesByFilters(clientId, status, startDate, endDate, pageable));
    }

    @PostMapping("/generate")
    public ResponseEntity<InvoiceResponse> generateInvoice(@Valid @RequestBody InvoiceGenerateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.generateInvoice(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InvoiceResponse> updateInvoiceStatus(
            @PathVariable Integer id,
            @Valid @RequestBody InvoiceStatusUpdateRequest request) {
        return ResponseEntity.ok(invoiceService.updateInvoiceStatus(id, request));
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<InvoiceResponse> recordPayment(
            @PathVariable Integer id,
            @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.recordPayment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Integer id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}

