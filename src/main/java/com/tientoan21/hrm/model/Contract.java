package com.tientoan21.hrm.model;

import com.tientoan21.hrm.enums.ContractStatus;
import com.tientoan21.hrm.enums.ContractType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "contracts")
public class Contract extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal baseSalary;
    private ContractType contractType;
    private ContractStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
