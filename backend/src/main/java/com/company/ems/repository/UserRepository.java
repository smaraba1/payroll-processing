package com.company.ems.repository;

import com.company.ems.domain.User;
import com.company.ems.domain.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByManagerId(Integer managerId);

    Page<User> findByIsActiveTrue(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.manager.id = :managerId AND u.isActive = true")
    List<User> findActiveDirectReportsByManagerId(@Param("managerId") Integer managerId);

    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:department IS NULL OR u.department = :department) AND " +
           "u.isActive = true")
    Page<User> findByFilters(@Param("role") UserRole role,
                             @Param("department") String department,
                             Pageable pageable);
}

