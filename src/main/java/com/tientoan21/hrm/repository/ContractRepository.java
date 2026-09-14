package com.tientoan21.hrm.repository;

import com.tientoan21.hrm.model.Contract;
import com.tientoan21.hrm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract,Long> {
    @Query("select c from Contract c where c.user = :user " +
            "and c.status = 'ACTIVE' " +
            "and c.startDate <= :startDate " +
            "and (c.endDate IS NULL or c.endDate >= :endDate) " +
            "order by c.startDate desc limit 1")
    Optional<Contract> findActiveContractForPayroll(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
