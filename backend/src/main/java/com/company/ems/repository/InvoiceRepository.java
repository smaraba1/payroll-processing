package com.company.ems.repository;

import com.company.ems.domain.Invoice;
import com.company.ems.domain.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    Page<Invoice> findByClientId(Integer clientId, Pageable pageable);

    Page<Invoice> findByStatus(InvoiceStatus status, Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE " +
           "(:clientId IS NULL OR i.client.id = :clientId) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:startDate IS NULL OR i.issueDate >= :startDate) AND " +
           "(:endDate IS NULL OR i.issueDate <= :endDate)")
    Page<Invoice> findByFilters(@Param("clientId") Integer clientId,
                                @Param("status") InvoiceStatus status,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate,
                                Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE i.status = 'OVERDUE'")
    List<Invoice> findOverdueInvoices();
}

