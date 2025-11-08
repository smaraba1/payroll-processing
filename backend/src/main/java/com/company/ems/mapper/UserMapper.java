package com.company.ems.mapper;

import com.company.ems.api.dto.user.UserRequest;
import com.company.ems.api.dto.user.UserResponse;
import com.company.ems.domain.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getRole(),
                user.getManager() != null ? user.getManager().getId() : null,
                user.getManager() != null ? user.getManager().getFullName() : null,
                user.getDepartment(),
                user.getJobTitle(),
                user.getHireDate(),
                user.getIsActive()
        );
    }

    public User toEntity(UserRequest request) {
        return User.builder()
                .email(request.email())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(request.role())
                .department(request.department())
                .jobTitle(request.jobTitle())
                .hireDate(request.hireDate())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();
    }

    public void updateEntity(User user, UserRequest request) {
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setRole(request.role());
        user.setDepartment(request.department());
        user.setJobTitle(request.jobTitle());
        user.setHireDate(request.hireDate());
        if (request.isActive() != null) {
            user.setIsActive(request.isActive());
        }
    }
}

