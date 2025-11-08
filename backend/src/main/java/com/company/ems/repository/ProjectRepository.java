package com.company.ems.repository;

import com.company.ems.domain.Project;
import com.company.ems.domain.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {

    List<Project> findByClientId(Integer clientId);

    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.status = :status AND p.client.id = :clientId")
    List<Project> findByClientIdAndStatus(@Param("clientId") Integer clientId,
                                          @Param("status") ProjectStatus status);

    @Query("SELECT DISTINCT p FROM Project p " +
           "JOIN p.projectAssignments pa " +
           "WHERE pa.user.id = :userId AND p.status = 'ACTIVE'")
    List<Project> findActiveProjectsByUserId(@Param("userId") Integer userId);

    @Query("SELECT p FROM Project p WHERE p.status = 'ACTIVE'")
    List<Project> findAllActiveProjects();
}

