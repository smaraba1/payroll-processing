package com.company.ems.mapper;

import com.company.ems.api.dto.invoice.InvoiceLineItemResponse;
import com.company.ems.api.dto.invoice.InvoiceResponse;
import com.company.ems.domain.Invoice;
import com.company.ems.domain.InvoiceLineItem;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class InvoiceMapper {

    public InvoiceResponse toResponse(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getClient().getId(),
                invoice.getClient().getName(),
                invoice.getIssueDate(),
                invoice.getDueDate(),
                invoice.getStatus(),
                invoice.getTotalAmount(),
                invoice.getAmountPaid(),
                invoice.getBalanceDue(),
                invoice.getLineItems().stream()
                        .map(this::toLineItemResponse)
                        .collect(Collectors.toList())
        );
    }

    public InvoiceLineItemResponse toLineItemResponse(InvoiceLineItem item) {
        return new InvoiceLineItemResponse(
                item.getId(),
                item.getProject() != null ? item.getProject().getId() : null,
                item.getProject() != null ? item.getProject().getName() : null,
                item.getUser() != null ? item.getUser().getId() : null,
                item.getUser() != null ? item.getUser().getFullName() : null,
                item.getDescription(),
                item.getHours(),
                item.getRate(),
                item.getLineTotal()
        );
    }
}

