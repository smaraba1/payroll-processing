package com.company.ems.api;

import com.company.ems.api.dto.project.ProjectAssignmentRequest;
import com.company.ems.api.dto.project.ProjectRequest;
import com.company.ems.api.dto.project.ProjectResponse;
import com.company.ems.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getAllProjects(Pageable pageable) {
        return ResponseEntity.ok(projectService.getAllProjects(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Integer id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByClientId(@PathVariable Integer clientId) {
        return ResponseEntity.ok(projectService.getProjectsByClientId(clientId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectResponse>> getActiveProjectsByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(projectService.getActiveProjectsByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Integer id,
                                                         @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignUserToProject(@Valid @RequestBody ProjectAssignmentRequest request) {
        projectService.assignUserToProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unassignUserFromProject(
            @RequestParam Integer userId,
            @RequestParam Integer projectId) {
        projectService.unassignUserFromProject(userId, projectId);
        return ResponseEntity.noContent().build();
    }
}

