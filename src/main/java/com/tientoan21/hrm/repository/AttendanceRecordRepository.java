package com.tientoan21.hrm.repository;

import com.tientoan21.hrm.model.AttendanceRecord;
import com.tientoan21.hrm.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord,Long> {
    Page<AttendanceRecord> findAllByUser(User user, Pageable pageable);

    Optional<AttendanceRecord> findByUserAndDate(User user, LocalDate targetLogicalDate);

    List<AttendanceRecord> findAllByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
