package com.tientoan21.hrm.model;

import com.tientoan21.hrm.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "punch_requests")
public class PunchRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate targetDate;
    private LocalDateTime requestedInTime;
    private LocalDateTime requestedOutTime;

    private String reason;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private Long approverId;
}
