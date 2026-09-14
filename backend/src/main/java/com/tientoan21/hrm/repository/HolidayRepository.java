package com.tientoan21.hrm.repository;

import com.tientoan21.hrm.model.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findAllByDateBetween(LocalDate startDate, LocalDate endDate);
}
