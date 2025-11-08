package com.company.ems.repository;

import com.company.ems.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByInvoiceId(Integer invoiceId);

    @Query("SELECT p FROM Payment p " +
           "WHERE p.invoice.client.id = :clientId " +
           "AND p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findByClientIdAndDateRange(@Param("clientId") Integer clientId,
                                             @Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate);
}

