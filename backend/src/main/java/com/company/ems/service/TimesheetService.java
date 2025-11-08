package com.company.ems.service;

import com.company.ems.api.dto.timesheet.TimesheetApprovalRequest;
import com.company.ems.api.dto.timesheet.TimesheetRequest;
import com.company.ems.api.dto.timesheet.TimesheetResponse;
import com.company.ems.domain.*;
import com.company.ems.mapper.TimesheetMapper;
import com.company.ems.repository.ProjectRepository;
import com.company.ems.repository.TimesheetRepository;
import com.company.ems.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimesheetService {

    private final TimesheetRepository timesheetRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TimesheetMapper timesheetMapper;

    @Transactional(readOnly = true)
    public Page<TimesheetResponse> getTimesheetsByUserId(Integer userId, Pageable pageable) {
        return timesheetRepository.findByUserId(userId, pageable)
                .map(timesheetMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public TimesheetResponse getTimesheetById(Integer id) {
        Timesheet timesheet = timesheetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Timesheet not found with id: " + id));
        return timesheetMapper.toResponse(timesheet);
    }

    @Transactional(readOnly = true)
    public Page<TimesheetResponse> getPendingTimesheetsForManager(Integer managerId, Pageable pageable) {
        return timesheetRepository.findByManagerIdAndStatus(managerId, TimesheetStatus.SUBMITTED, pageable)
                .map(timesheetMapper::toResponse);
    }

    @Transactional
    public TimesheetResponse createOrUpdateTimesheet(Integer userId, TimesheetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Validate week start date is Sunday
        if (request.weekStartDate().getDayOfWeek() != DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Week start date must be a Sunday");
        }

        LocalDate weekEndDate = request.weekStartDate().plusDays(6); // Saturday

        Timesheet timesheet = timesheetRepository
                .findByUserIdAndWeekStartDate(userId, request.weekStartDate())
                .orElse(Timesheet.builder()
                        .user(user)
                        .weekStartDate(request.weekStartDate())
                        .status(TimesheetStatus.DRAFT)
                        .build());

        if (timesheet.getStatus() != TimesheetStatus.DRAFT &&
            timesheet.getStatus() != TimesheetStatus.REJECTED) {
            throw new IllegalStateException("Cannot modify a submitted or approved timesheet");
        }

        // Clear existing entries and add new ones
        timesheet.getTimeEntries().clear();

        if (request.timeEntries() != null && !request.timeEntries().isEmpty()) {
            for (var entryRequest : request.timeEntries()) {
                // Validate entry date is within the week
                if (entryRequest.entryDate().isBefore(request.weekStartDate()) ||
                    entryRequest.entryDate().isAfter(weekEndDate)) {
                    throw new IllegalArgumentException(
                        String.format("Entry date %s must be within the week (%s to %s)",
                            entryRequest.entryDate(), request.weekStartDate(), weekEndDate)
                    );
                }

                // Validate project is required for billable entries
                if (entryRequest.taskType() == TaskType.BILLABLE && entryRequest.projectId() == null) {
                    throw new IllegalArgumentException("Project is required for billable time entries");
                }

                TimeEntry entry = timesheetMapper.toTimeEntry(entryRequest);

                if (entryRequest.projectId() != null) {
                    Project project = projectRepository.findById(entryRequest.projectId())
                            .orElseThrow(() -> new EntityNotFoundException("Project not found"));
                    entry.setProject(project);
                } else {
                    // Clear project for non-billable entries
                    entry.setProject(null);
                }

                timesheet.addTimeEntry(entry);
            }
        }

        timesheet = timesheetRepository.save(timesheet);
        return timesheetMapper.toResponse(timesheet);
    }

    @Transactional
    public TimesheetResponse submitTimesheet(Integer timesheetId) {
        Timesheet timesheet = timesheetRepository.findById(timesheetId)
                .orElseThrow(() -> new EntityNotFoundException("Timesheet not found"));

        if (timesheet.getStatus() != TimesheetStatus.DRAFT &&
            timesheet.getStatus() != TimesheetStatus.REJECTED) {
            throw new IllegalStateException("Timesheet is not in a submittable state");
        }

        if (timesheet.getTimeEntries().isEmpty()) {
            throw new IllegalStateException("Cannot submit an empty timesheet");
        }

        // Validate week start date is Sunday
        if (timesheet.getWeekStartDate().getDayOfWeek() != DayOfWeek.SUNDAY) {
            throw new IllegalStateException("Timesheet week start date must be a Sunday");
        }

        LocalDate weekEndDate = timesheet.getWeekStartDate().plusDays(6);

        // Validate all entries are within the week and have required fields
        for (TimeEntry entry : timesheet.getTimeEntries()) {
            if (entry.getEntryDate().isBefore(timesheet.getWeekStartDate()) ||
                entry.getEntryDate().isAfter(weekEndDate)) {
                throw new IllegalStateException(
                    String.format("Entry date %s is outside the timesheet week (%s to %s)",
                        entry.getEntryDate(), timesheet.getWeekStartDate(), weekEndDate)
                );
            }

            if (entry.getTaskType() == TaskType.BILLABLE && entry.getProject() == null) {
                throw new IllegalStateException("Billable entries must have a project assigned");
            }
        }

        timesheet.setStatus(TimesheetStatus.SUBMITTED);
        timesheet.setSubmittedAt(LocalDateTime.now());
        timesheet.setRejectionComments(null);

        timesheet = timesheetRepository.save(timesheet);
        return timesheetMapper.toResponse(timesheet);
    }

    @Transactional
    public TimesheetResponse approveOrRejectTimesheet(Integer timesheetId, TimesheetApprovalRequest request) {
        Timesheet timesheet = timesheetRepository.findById(timesheetId)
                .orElseThrow(() -> new EntityNotFoundException("Timesheet not found"));

        if (timesheet.getStatus() != TimesheetStatus.SUBMITTED) {
            throw new IllegalStateException("Only submitted timesheets can be approved or rejected");
        }

        if (request.approved()) {
            timesheet.setStatus(TimesheetStatus.APPROVED);
            timesheet.setApprovedAt(LocalDateTime.now());
            timesheet.setRejectionComments(null);
        } else {
            if (request.comments() == null || request.comments().isBlank()) {
                throw new IllegalArgumentException("Rejection comments are required");
            }
            timesheet.setStatus(TimesheetStatus.REJECTED);
            timesheet.setRejectionComments(request.comments());
            timesheet.setApprovedAt(null);
        }

        timesheet = timesheetRepository.save(timesheet);
        return timesheetMapper.toResponse(timesheet);
    }

    @Transactional
    public void deleteTimesheet(Integer id) {
        Timesheet timesheet = timesheetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Timesheet not found"));

        if (timesheet.getStatus() != TimesheetStatus.DRAFT) {
            throw new IllegalStateException("Only draft timesheets can be deleted");
        }

        timesheetRepository.delete(timesheet);
    }
}

