package com.company.ems.service;

import com.company.ems.api.dto.user.UserRequest;
import com.company.ems.api.dto.user.UserResponse;
import com.company.ems.domain.User;
import com.company.ems.domain.UserRole;
import com.company.ems.mapper.UserMapper;
import com.company.ems.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getDirectReports(Integer managerId) {
        return userRepository.findActiveDirectReportsByManagerId(managerId)
                .stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = userMapper.toEntity(request);

        if (request.password() != null && !request.password().isBlank()) {
            user.setHashedPassword(passwordEncoder.encode(request.password()));
        } else {
            // Generate a default password for admin-created users
            user.setHashedPassword(passwordEncoder.encode("ChangeMe123!"));
        }

        // Require manager for employees
        if (request.role() == UserRole.ROLE_EMPLOYEE) {
            if (request.managerId() == null) {
                throw new IllegalArgumentException("Manager is required for employees");
            }
            User manager = userRepository.findById(request.managerId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found"));
            user.setManager(manager);
        } else if (request.managerId() != null) {
            // Optional manager for other roles
            User manager = userRepository.findById(request.managerId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found"));
            user.setManager(manager);
        }

        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Integer id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        if (!user.getEmail().equals(request.email()) &&
            userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        userMapper.updateEntity(user, request);

        if (request.password() != null && !request.password().isBlank()) {
            user.setHashedPassword(passwordEncoder.encode(request.password()));
        }

        // Require manager for employees
        if (request.role() == UserRole.ROLE_EMPLOYEE) {
            if (request.managerId() == null) {
                throw new IllegalArgumentException("Manager is required for employees");
            }
            User manager = userRepository.findById(request.managerId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found"));
            user.setManager(manager);
        } else if (request.managerId() != null) {
            // Optional manager for other roles
            User manager = userRepository.findById(request.managerId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found"));
            user.setManager(manager);
        } else {
            user.setManager(null);
        }

        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponse deactivateUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        user.setIsActive(false);
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }
}

