package com.tientoan21.hrm.repository;

import com.tientoan21.hrm.model.TimeLog;
import com.tientoan21.hrm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    List<TimeLog> findByUserIdAndPunchTimeBetween(Long userId, LocalDateTime attr0, LocalDateTime attr1);

    Optional<TimeLog> findTopByUserIdOrderByPunchTimeDesc(Long userId);
}
