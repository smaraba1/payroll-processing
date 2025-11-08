package com.company.ems.repository;

import com.company.ems.domain.TaskType;
import com.company.ems.domain.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Integer> {

    List<TimeEntry> findByTimesheetId(Integer timesheetId);

    @Query("SELECT te FROM TimeEntry te " +
           "WHERE te.timesheet.user.id = :userId " +
           "AND te.entryDate BETWEEN :startDate AND :endDate")
    List<TimeEntry> findByUserIdAndDateRange(@Param("userId") Integer userId,
                                             @Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate);

    @Query("SELECT te FROM TimeEntry te " +
           "JOIN te.timesheet ts " +
           "WHERE te.project.client.id = :clientId " +
           "AND ts.status = 'APPROVED' " +
           "AND te.taskType = 'BILLABLE' " +
           "AND te.entryDate BETWEEN :startDate AND :endDate")
    List<TimeEntry> findBillableEntriesByClientAndDateRange(@Param("clientId") Integer clientId,
                                                            @Param("startDate") LocalDate startDate,
                                                            @Param("endDate") LocalDate endDate);

    @Query("SELECT te FROM TimeEntry te " +
           "WHERE te.project.id = :projectId " +
           "AND te.entryDate BETWEEN :startDate AND :endDate")
    List<TimeEntry> findByProjectIdAndDateRange(@Param("projectId") Integer projectId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);
}

