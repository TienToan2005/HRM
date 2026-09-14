package com.tientoan21.hrm.repository;

import com.tientoan21.hrm.model.Salary;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary,Long> {

    Optional<Salary> findByUserIdAndMonthAndYear(Long id, int month, int year);

    Page<Salary> findAllByMonthAndYear(int month, int year, Pageable pageable);
}
