package com.company.ems.service;

import com.company.ems.api.dto.project.ProjectAssignmentRequest;
import com.company.ems.api.dto.project.ProjectRequest;
import com.company.ems.api.dto.project.ProjectResponse;
import com.company.ems.domain.*;
import com.company.ems.mapper.ProjectMapper;
import com.company.ems.repository.ClientRepository;
import com.company.ems.repository.ProjectAssignmentRepository;
import com.company.ems.repository.ProjectRepository;
import com.company.ems.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;
    private final ProjectAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getAllProjects(Pageable pageable) {
        return projectRepository.findAll(pageable)
                .map(projectMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Integer id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
        return projectMapper.toResponse(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByClientId(Integer clientId) {
        return projectRepository.findByClientId(clientId)
                .stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getActiveProjectsByUserId(Integer userId) {
        // Get user to check role
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // If user is ADMIN, return all active projects
        if (user.getRole() == UserRole.ROLE_ADMIN) {
            return projectRepository.findAllActiveProjects()
                    .stream()
                    .map(projectMapper::toResponse)
                    .collect(Collectors.toList());
        }

        // For other users, return only assigned projects
        List<Project> assignedProjects = projectRepository.findActiveProjectsByUserId(userId);

        // If no assigned projects, return empty list (user needs to be assigned by admin)
        return assignedProjects.stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        Client client = clientRepository.findById(request.clientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + request.clientId()));

        Project project = projectMapper.toEntity(request);
        project.setClient(client);

        project = projectRepository.save(project);

        // Assign employees to project if provided
        if (request.employeeIds() != null && !request.employeeIds().isEmpty()) {
            for (Integer employeeId : request.employeeIds()) {
                User user = userRepository.findById(employeeId)
                        .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + employeeId));

                // Check if assignment already exists (shouldn't happen for new project, but safety check)
                if (!assignmentRepository.existsByUserIdAndProjectId(employeeId, project.getId())) {
                    ProjectAssignment assignment = ProjectAssignment.builder()
                            .user(user)
                            .project(project)
                            .build();
                    assignmentRepository.save(assignment);
                }
            }
        }

        // Refresh to get the assignments
        project = projectRepository.findById(project.getId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        return projectMapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Integer id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));

        if (!project.getClient().getId().equals(request.clientId())) {
            Client client = clientRepository.findById(request.clientId())
                    .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + request.clientId()));
            project.setClient(client);
        }

        projectMapper.updateEntity(project, request);
        project = projectRepository.save(project);

        // Update employee assignments if provided
        if (request.employeeIds() != null) {
            // Get current assignments
            List<ProjectAssignment> currentAssignments = assignmentRepository.findByProjectId(id);

            // Get current employee IDs
            Set<Integer> currentEmployeeIds = currentAssignments.stream()
                    .map(assignment -> assignment.getUser().getId())
                    .collect(Collectors.toSet());

            // Get new employee IDs set
            Set<Integer> newEmployeeIds = new HashSet<>(request.employeeIds());

            // Remove assignments that are no longer in the new list
            for (ProjectAssignment assignment : currentAssignments) {
                if (!newEmployeeIds.contains(assignment.getUser().getId())) {
                    assignmentRepository.delete(assignment);
                }
            }

            // Add new assignments
            for (Integer employeeId : newEmployeeIds) {
                if (!currentEmployeeIds.contains(employeeId)) {
                    User user = userRepository.findById(employeeId)
                            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + employeeId));

                    ProjectAssignment assignment = ProjectAssignment.builder()
                            .user(user)
                            .project(project)
                            .build();
                    assignmentRepository.save(assignment);
                }
            }
        }

        // Refresh to get the updated assignments
        project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        return projectMapper.toResponse(project);
    }

    @Transactional
    public void deleteProject(Integer id) {
        if (!projectRepository.existsById(id)) {
            throw new EntityNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    @Transactional
    public void assignUserToProject(ProjectAssignmentRequest request) {
        if (assignmentRepository.existsByUserIdAndProjectId(request.userId(), request.projectId())) {
            throw new IllegalStateException("User is already assigned to this project");
        }

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        ProjectAssignment assignment = ProjectAssignment.builder()
                .user(user)
                .project(project)
                .build();

        assignmentRepository.save(assignment);
    }

    @Transactional
    public void unassignUserFromProject(Integer userId, Integer projectId) {
        ProjectAssignment assignment = assignmentRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found"));

        assignmentRepository.delete(assignment);
    }
}

