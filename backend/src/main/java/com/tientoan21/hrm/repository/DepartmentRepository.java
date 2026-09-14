package com.tientoan21.hrm.repository;

import com.tientoan21.hrm.model.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department,Long> {
    Optional<Department> findByName(String name);

    Page<Department> searchByName(String name, Pageable pageable);
}
