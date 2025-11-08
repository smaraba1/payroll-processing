package com.company.ems.api;

import com.company.ems.api.dto.timesheet.TimesheetApprovalRequest;
import com.company.ems.api.dto.timesheet.TimesheetRequest;
import com.company.ems.api.dto.timesheet.TimesheetResponse;
import com.company.ems.service.TimesheetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/timesheets")
@RequiredArgsConstructor
public class TimesheetController {

    private final TimesheetService timesheetService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<TimesheetResponse>> getTimesheetsByUserId(
            @PathVariable Integer userId,
            Pageable pageable) {
        return ResponseEntity.ok(timesheetService.getTimesheetsByUserId(userId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimesheetResponse> getTimesheetById(@PathVariable Integer id) {
        return ResponseEntity.ok(timesheetService.getTimesheetById(id));
    }

    @GetMapping("/pending/manager/{managerId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Page<TimesheetResponse>> getPendingTimesheetsForManager(
            @PathVariable Integer managerId,
            Pageable pageable) {
        return ResponseEntity.ok(timesheetService.getPendingTimesheetsForManager(managerId, pageable));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<TimesheetResponse> createOrUpdateTimesheet(
            @PathVariable Integer userId,
            @Valid @RequestBody TimesheetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(timesheetService.createOrUpdateTimesheet(userId, request));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<TimesheetResponse> submitTimesheet(@PathVariable Integer id) {
        return ResponseEntity.ok(timesheetService.submitTimesheet(id));
    }

    @PostMapping("/{id}/approval")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<TimesheetResponse> approveOrRejectTimesheet(
            @PathVariable Integer id,
            @Valid @RequestBody TimesheetApprovalRequest request) {
        return ResponseEntity.ok(timesheetService.approveOrRejectTimesheet(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimesheet(@PathVariable Integer id) {
        timesheetService.deleteTimesheet(id);
        return ResponseEntity.noContent().build();
    }
}

