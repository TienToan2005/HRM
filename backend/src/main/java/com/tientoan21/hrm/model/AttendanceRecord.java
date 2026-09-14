package com.tientoan21.hrm.model;

import com.tientoan21.hrm.enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "attendance_records")
public class AttendanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalDateTime firstIn;
    private LocalDateTime lastOut;
    private AttendanceStatus status;

    private Integer lateMinutes;
    private Integer earlyLeaveMinutes;
    private Double totalWorkingHours;
    private Double overtimeHours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
