package com.company.ems.mapper;

import com.company.ems.api.dto.timesheet.TimeEntryRequest;
import com.company.ems.api.dto.timesheet.TimeEntryResponse;
import com.company.ems.api.dto.timesheet.TimesheetResponse;
import com.company.ems.domain.TimeEntry;
import com.company.ems.domain.Timesheet;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Component
public class TimesheetMapper {

    public TimesheetResponse toResponse(Timesheet timesheet) {
        BigDecimal totalHours = timesheet.getTimeEntries().stream()
                .map(TimeEntry::getHours)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new TimesheetResponse(
                timesheet.getId(),
                timesheet.getUser().getId(),
                timesheet.getUser().getFullName(),
                timesheet.getWeekStartDate(),
                timesheet.getStatus(),
                timesheet.getSubmittedAt(),
                timesheet.getApprovedAt(),
                timesheet.getRejectionComments(),
                timesheet.getTimeEntries().stream()
                        .map(this::toTimeEntryResponse)
                        .collect(Collectors.toList()),
                totalHours
        );
    }

    public TimeEntryResponse toTimeEntryResponse(TimeEntry entry) {
        return new TimeEntryResponse(
                entry.getId(),
                entry.getProject() != null ? entry.getProject().getId() : null,
                entry.getProject() != null ? entry.getProject().getName() : null,
                entry.getProject() != null ? entry.getProject().getClient().getName() : null,
                entry.getEntryDate(),
                entry.getHours(),
                entry.getTaskType(),
                entry.getNotes()
        );
    }

    public TimeEntry toTimeEntry(TimeEntryRequest request) {
        return TimeEntry.builder()
                .entryDate(request.entryDate())
                .hours(request.hours())
                .taskType(request.taskType())
                .notes(request.notes())
                .build();
    }
}

