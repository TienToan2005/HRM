package com.tientoan21.hrm.model;

import com.tientoan21.hrm.enums.SalaryStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "salaries")
@SQLRestriction("deleted_at IS NULL")
public class Salary extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int month;
    private int year;

    private Double totalWorkingHours;
    private Double totalOvertimeHours;

    private BigDecimal baseSalary;
    private BigDecimal overtimePay;
    private BigDecimal allowance;
    private BigDecimal penalty;
    private BigDecimal holidayPay;
    private Integer absentDays;
    private BigDecimal absentDeduction;
    private BigDecimal totalSalary;

    @Enumerated(EnumType.STRING)
    private SalaryStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
