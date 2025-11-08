package com.company.ems.repository;

import com.company.ems.domain.ProjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Integer> {

    Optional<ProjectAssignment> findByUserIdAndProjectId(Integer userId, Integer projectId);

    List<ProjectAssignment> findByUserId(Integer userId);

    List<ProjectAssignment> findByProjectId(Integer projectId);

    boolean existsByUserIdAndProjectId(Integer userId, Integer projectId);

    @Query("SELECT pa FROM ProjectAssignment pa " +
           "WHERE pa.project.id = :projectId")
    List<ProjectAssignment> findAllByProjectId(@Param("projectId") Integer projectId);
}

