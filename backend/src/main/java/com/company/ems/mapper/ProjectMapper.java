package com.company.ems.mapper;

import com.company.ems.api.dto.project.ProjectRequest;
import com.company.ems.api.dto.project.ProjectResponse;
import com.company.ems.domain.Project;
import com.company.ems.domain.ProjectStatus;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getClient().getId(),
                project.getClient().getName(),
                project.getDefaultBillableRate(),
                project.getStatus()
        );
    }

    public Project toEntity(ProjectRequest request) {
        return Project.builder()
                .name(request.name())
                .defaultBillableRate(request.defaultBillableRate())
                .status(request.status() != null ? request.status() : ProjectStatus.ACTIVE)
                .build();
    }

    public void updateEntity(Project project, ProjectRequest request) {
        project.setName(request.name());
        project.setDefaultBillableRate(request.defaultBillableRate());
        if (request.status() != null) {
            project.setStatus(request.status());
        }
    }
}

