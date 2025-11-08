package com.company.ems.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "timesheets",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "week_start_date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Timesheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimesheetStatus status = TimesheetStatus.DRAFT;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_comments")
    private String rejectionComments;

    @OneToMany(mappedBy = "timesheet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TimeEntry> timeEntries = new ArrayList<>();

    public void addTimeEntry(TimeEntry entry) {
        timeEntries.add(entry);
        entry.setTimesheet(this);
    }

    public void removeTimeEntry(TimeEntry entry) {
        timeEntries.remove(entry);
        entry.setTimesheet(null);
    }
}

