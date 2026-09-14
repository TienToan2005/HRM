package com.tientoan21.hrm.service;

import com.tientoan21.hrm.dto.reponse.SalaryResponse;
import com.tientoan21.hrm.enums.AttendanceStatus;
import com.tientoan21.hrm.enums.ErrorCode;
import com.tientoan21.hrm.enums.SalaryStatus;
import com.tientoan21.hrm.exception.AppException;
import com.tientoan21.hrm.mapper.SalaryMapper;
import com.tientoan21.hrm.model.*;
import com.tientoan21.hrm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalaryService {
    private final SalaryRepository salaryRepository;
    private final UserRepository userRepository;
    private final SalaryMapper salaryMapper;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final ContractRepository contractRepository;
    private final HolidayRepository holidayRepository;

    @Transactional
    public SalaryResponse generatePaycheck(Long userId, int month, int year){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        LocalDate startDate = LocalDate.of(year, month, 1); // 2026-08-01
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth()); // 2026-08-31

        Contract activeContract = contractRepository.findActiveContractForPayroll(user, startDate, endDate)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));
        BigDecimal baseSalary = activeContract.getBaseSalary();

        BigDecimal dailyRate = baseSalary.divide(new BigDecimal("26"), 2, RoundingMode.HALF_UP);
        BigDecimal hourlyRate = dailyRate.divide(new BigDecimal("8"), 2, RoundingMode.HALF_UP);

        List<Holiday> holidays = holidayRepository.findAllByDateBetween(startDate,endDate);
        Map<LocalDate,BigDecimal> holidayMap = holidays.stream()
                .collect(Collectors.toMap(Holiday::getDate, Holiday::getMultiplier));

        List<AttendanceRecord> records = attendanceRecordRepository
                .findAllByUserAndDateBetween(user, startDate, endDate);

        double totalNormalWorkHours = 0;
        double totalHolidayWorkHours = 0;
        double totalOtHours = 0;
        int totalPenaltyMinutes = 0;
        int absentDays = 0;
        BigDecimal totalHolidayPay = BigDecimal.ZERO;

        for(AttendanceRecord record : records){
            LocalDate recordDate = record.getDate();
            double dailyHours = record.getTotalWorkingHours();

            if (record.getStatus() == AttendanceStatus.ABSENT) {
                absentDays++;
            }

            if(holidayMap.containsKey(recordDate) && dailyHours > 0){
                BigDecimal multiplier = holidayMap.get(recordDate);
                BigDecimal dailyHolidayPay = hourlyRate
                        .multiply(BigDecimal.valueOf(dailyHours))
                        .multiply(multiplier);
                totalHolidayPay = totalHolidayPay.add(dailyHolidayPay);
                totalHolidayWorkHours += dailyHours;
            } else {
                totalNormalWorkHours += dailyHours;
            }

            totalOtHours += record.getOvertimeHours();
            totalPenaltyMinutes += record.getLateMinutes() + record.getEarlyLeaveMinutes();
        }

        BigDecimal absentDeduction = dailyRate.multiply(BigDecimal.valueOf(absentDays));
        BigDecimal overtimePay = hourlyRate.multiply(BigDecimal.valueOf(totalOtHours)).multiply(new BigDecimal("1.5"));
        BigDecimal penalty = new BigDecimal(totalPenaltyMinutes).multiply(new BigDecimal("5000"));

        BigDecimal totalSalary = baseSalary
                .subtract(absentDeduction)
                .add(totalHolidayPay)
                .add(overtimePay)
                .subtract(penalty);

        if (totalSalary.compareTo(BigDecimal.ZERO) < 0) totalSalary = BigDecimal.ZERO;

        Salary salary = salaryRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .orElse(new Salary());

        salary.setUser(user);
        salary.setMonth(month);
        salary.setYear(year);

        salary.setTotalWorkingHours(totalNormalWorkHours + totalHolidayWorkHours);
        salary.setTotalOvertimeHours(totalOtHours);
        salary.setBaseSalary(baseSalary);

        salary.setAbsentDays(absentDays);
        salary.setAbsentDeduction(absentDeduction);

        salary.setHolidayPay(totalHolidayPay);
        salary.setOvertimePay(overtimePay);
        salary.setPenalty(penalty);
        salary.setAllowance(BigDecimal.ZERO);
        salary.setTotalSalary(totalSalary);
        salary.setStatus(SalaryStatus.PENDING);
        salary.setCreatedAt(LocalDateTime.now());
        Salary saved = salaryRepository.save(salary);

        return salaryMapper.toSalaryResponse(saved);
    }
    @Transactional
    public void generatePaycheckForAll(int month, int year) {
        List<User> activeUsers = userRepository.findAll();

        for (User user : activeUsers) {
            try {
                generatePaycheck(user.getId(), month, year);
            } catch (AppException e) {
                log.warn("Skipping salary for user {}: {}", user.getId(), e.getMessage());
            }
        }
    }
    public SalaryResponse getMySalary(int month, int year){
        Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Salary salary = salaryRepository.findByUserIdAndMonthAndYear(id, month, year)
                .orElseThrow(() -> new AppException(ErrorCode.PAYCHECK_NOT_FOUND));

        return salaryMapper.toSalaryResponse(salary);
    }
    public Page<SalaryResponse> getAllSalary(int page, int size, int month, int year){
        Pageable pageable = PageRequest.of(page, size);
        Page<Salary> salaryPage = salaryRepository.findAllByMonthAndYear(month,year,pageable);

        return salaryPage.map(salaryMapper::toSalaryResponse);
    }
    @Transactional
    public SalaryResponse paySalary(Long salaryId) {
        Salary salary = salaryRepository.findById(salaryId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYCHECK_NOT_FOUND));

        if (salary.getStatus() == SalaryStatus.PAID) {
            throw new AppException(ErrorCode.ALREADY_PAID);
        }

        salary.setStatus(SalaryStatus.PAID);
        salary.setUpdatedAt(LocalDateTime.now());

        return salaryMapper.toSalaryResponse(salaryRepository.save(salary));
    }
}
