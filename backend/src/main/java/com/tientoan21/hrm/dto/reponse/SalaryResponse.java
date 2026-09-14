package com.tientoan21.hrm.dto.reponse;

import com.tientoan21.hrm.enums.SalaryStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalaryResponse {
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
    private Long userId;
}
