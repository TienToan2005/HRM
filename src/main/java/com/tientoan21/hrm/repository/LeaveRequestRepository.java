package com.tientoan21.hrm.repository;

import com.tientoan21.hrm.enums.RequestStatus;
import com.tientoan21.hrm.model.LeaveRequest;
import com.tientoan21.hrm.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    @Query("SELECT COUNT(l) > 0 FROM LeaveRequest l WHERE l.user.id = :userId " +
            "AND l.status = :status " +
            "AND :targetDate BETWEEN l.dateFrom AND l.dateTo")
    boolean hasApprovedLeaveForDate(
            @Param("userId") Long userId,
            @Param("targetDate") LocalDate targetDate,
            @Param("status") RequestStatus status);

    Page<LeaveRequest> findAllByUser(User user, Pageable pageable);
}
