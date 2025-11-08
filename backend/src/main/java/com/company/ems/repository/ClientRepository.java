package com.company.ems.repository;

import com.company.ems.domain.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {

    Page<Client> findByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsByName(String name);
}

