package com.company.ems.repository;

import com.company.ems.domain.Timesheet;
import com.company.ems.domain.TimesheetStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Integer> {

    Optional<Timesheet> findByUserIdAndWeekStartDate(Integer userId, LocalDate weekStartDate);

    List<Timesheet> findByUserId(Integer userId);

    Page<Timesheet> findByUserId(Integer userId, Pageable pageable);

    @Query("SELECT t FROM Timesheet t WHERE t.user.manager.id = :managerId AND t.status = :status")
    Page<Timesheet> findByManagerIdAndStatus(@Param("managerId") Integer managerId,
                                             @Param("status") TimesheetStatus status,
                                             Pageable pageable);

    @Query("SELECT t FROM Timesheet t WHERE t.status = :status")
    Page<Timesheet> findByStatus(@Param("status") TimesheetStatus status, Pageable pageable);

    @Query("SELECT t FROM Timesheet t WHERE " +
           "t.weekStartDate BETWEEN :startDate AND :endDate AND " +
           "(:userId IS NULL OR t.user.id = :userId) AND " +
           "(:status IS NULL OR t.status = :status)")
    List<Timesheet> findByDateRangeAndFilters(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate,
                                              @Param("userId") Integer userId,
                                              @Param("status") TimesheetStatus status);
}

