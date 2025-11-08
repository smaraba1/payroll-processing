package com.company.ems.service;

import com.company.ems.api.dto.invoice.InvoiceGenerateRequest;
import com.company.ems.api.dto.invoice.InvoiceResponse;
import com.company.ems.api.dto.invoice.InvoiceStatusUpdateRequest;
import com.company.ems.api.dto.invoice.PaymentRequest;
import com.company.ems.domain.*;
import com.company.ems.mapper.InvoiceMapper;
import com.company.ems.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;
    private final TimeEntryRepository timeEntryRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceMapper invoiceMapper;

    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getAllInvoices(Pageable pageable) {
        return invoiceRepository.findAll(pageable)
                .map(invoiceMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found with id: " + id));
        return invoiceMapper.toResponse(invoice);
    }

    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByClientId(Integer clientId, Pageable pageable) {
        return invoiceRepository.findByClientId(clientId, pageable)
                .map(invoiceMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByFilters(Integer clientId, InvoiceStatus status,
                                                      LocalDate startDate, LocalDate endDate,
                                                      Pageable pageable) {
        return invoiceRepository.findByFilters(clientId, status, startDate, endDate, pageable)
                .map(invoiceMapper::toResponse);
    }

    @Transactional
    public InvoiceResponse generateInvoice(InvoiceGenerateRequest request) {
        Client client = clientRepository.findById(request.clientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        List<TimeEntry> billableEntries = timeEntryRepository
                .findBillableEntriesByClientAndDateRange(
                        request.clientId(),
                        request.startDate(),
                        request.endDate()
                );

        if (billableEntries.isEmpty()) {
            throw new IllegalStateException("No billable time entries found for the selected period");
        }

        final Invoice invoice = Invoice.builder()
                .client(client)
                .issueDate(LocalDate.now())
                .dueDate(request.dueDate())
                .status(InvoiceStatus.DRAFT)
                .totalAmount(BigDecimal.ZERO)
                .amountPaid(BigDecimal.ZERO)
                .build();

        // Group entries by project and user
        Map<String, InvoiceLineItem> lineItemMap = new HashMap<>();

        for (TimeEntry entry : billableEntries) {
            String key = entry.getProject().getId() + "_" + entry.getTimesheet().getUser().getId();

            InvoiceLineItem lineItem = lineItemMap.computeIfAbsent(key, k -> {
                InvoiceLineItem item = InvoiceLineItem.builder()
                        .invoice(invoice)
                        .project(entry.getProject())
                        .user(entry.getTimesheet().getUser())
                        .description(entry.getProject().getName() + " - " + entry.getTimesheet().getUser().getFullName())
                        .hours(BigDecimal.ZERO)
                        .rate(entry.getProject().getDefaultBillableRate())
                        .lineTotal(BigDecimal.ZERO)
                        .build();
                invoice.getLineItems().add(item);
                return item;
            });

            BigDecimal newHours = lineItem.getHours().add(entry.getHours());
            lineItem.setHours(newHours);

            BigDecimal lineTotal = newHours.multiply(lineItem.getRate());
            lineItem.setLineTotal(lineTotal);
        }

        // Calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (InvoiceLineItem item : invoice.getLineItems()) {
            totalAmount = totalAmount.add(item.getLineTotal());
        }

        invoice.setTotalAmount(totalAmount);
        Invoice savedInvoice = invoiceRepository.save(invoice);

        return invoiceMapper.toResponse(savedInvoice);
    }

    @Transactional
    public InvoiceResponse updateInvoiceStatus(Integer id, InvoiceStatusUpdateRequest request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));

        invoice.setStatus(request.status());
        invoice = invoiceRepository.save(invoice);

        return invoiceMapper.toResponse(invoice);
    }

    @Transactional
    public InvoiceResponse recordPayment(Integer invoiceId, PaymentRequest request) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));

        Payment payment = Payment.builder()
                .invoice(invoice)
                .paymentDate(request.paymentDate())
                .amount(request.amount())
                .method(request.method())
                .notes(request.notes())
                .build();

        payment = paymentRepository.save(payment);

        BigDecimal newAmountPaid = invoice.getAmountPaid().add(request.amount());
        invoice.setAmountPaid(newAmountPaid);

        if (newAmountPaid.compareTo(invoice.getTotalAmount()) >= 0) {
            invoice.setStatus(InvoiceStatus.PAID);
        }

        invoice = invoiceRepository.save(invoice);

        return invoiceMapper.toResponse(invoice);
    }

    @Transactional
    public void deleteInvoice(Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));

        if (invoice.getStatus() != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Only draft invoices can be deleted");
        }

        invoiceRepository.delete(invoice);
    }
}

