package com.company.ems.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "hashed_password", nullable = false)
    private String hashedPassword;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reports_to_manager_id")
    private User manager;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    private String department;

    @Column(name = "job_title")
    private String jobTitle;

    @OneToMany(mappedBy = "manager")
    @Builder.Default
    private Set<User> directReports = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<ProjectAssignment> projectAssignments = new HashSet<>();

    public String getFullName() {
        return firstName + " " + lastName;
    }
}

