package com.tientoan21.hrm.service;

import com.tientoan21.hrm.enums.AttendanceStatus;
import com.tientoan21.hrm.enums.RequestStatus;
import com.tientoan21.hrm.model.AttendanceRecord;
import com.tientoan21.hrm.model.TimeLog;
import com.tientoan21.hrm.model.User;
import com.tientoan21.hrm.repository.AttendanceRecordRepository;
import com.tientoan21.hrm.repository.LeaveRequestRepository;
import com.tientoan21.hrm.repository.TimeLogRepository;
import com.tientoan21.hrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceProcessorService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final UserRepository userRepository;
    private final TimeLogRepository timeLogRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @Value("${attendance.debounce-minutes:2}")
    private long debounceMinutes;

    @Value("${attendance.cutoff-time:04:00}")
    private String cutoffTimeString;

    @Transactional
    public void saveRawPunchLog(Long userId, LocalDateTime punchTime){
        Optional<TimeLog> lastLogOpt = timeLogRepository.findTopByUserIdOrderByPunchTimeDesc(userId);

        if(lastLogOpt.isPresent()){
            LocalDateTime lastPunch = lastLogOpt.get().getPunchTime();
            if(Duration.between(lastPunch, punchTime).toMinutes() < debounceMinutes){
                log.warn("Debounce: Skip the user's continuous scanning process {}", userId);
                return;
            }
        }

        TimeLog logEntry = new TimeLog();
        logEntry.setUserId(userId);
        logEntry.setPunchTime(punchTime);
        timeLogRepository.save(logEntry);

        log.info("Fingerprint scan log saved for user {} at {}", userId, punchTime);

    }

    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void calculateAllEmployeesAttendance(){
        LocalDate targetDate = LocalDate.now().minusDays(1);
        log.info("Starting time aggregation for logic date: {}", targetDate);

        List<User> activeUsers = userRepository.findAll();

        for (User user : activeUsers){
            try {
                processDailyAttendanceForUser(user, targetDate);
            }
            catch (Exception e){
                log.error("Error aggregating work hours for user {}: {}", user.getId(), e.getMessage());
            }
        }
    }
    @Transactional
    public void manualRecalculateAttendance(LocalDate targetDate) {
        log.info("Admin/HR triggered manual recalculation for date: {}", targetDate);

        List<User> activeUsers = userRepository.findAll();

        for (User user : activeUsers) {
            try {
                processDailyAttendanceForUser(user, targetDate);
            } catch (Exception e) {
                log.error("Error during manual recalculation for user {}: {}", user.getId(), e.getMessage());
            }
        }
    }

    private void processDailyAttendanceForUser(User user, LocalDate targetLogicalDate) {
        LocalTime cutoffTime = LocalTime.parse(cutoffTimeString);
        LocalDateTime startRange = targetLogicalDate.atTime(cutoffTime);
        LocalDateTime endRange = targetLogicalDate.plusDays(1).atTime(cutoffTime).minusNanos(1);

        boolean isOnLeave = leaveRequestRepository.hasApprovedLeaveForDate(user.getId(), targetLogicalDate, RequestStatus.APPROVED);

        List<TimeLog> dailyLogs = timeLogRepository.findByUserIdAndPunchTimeBetween(user.getId(), startRange, endRange);
        AttendanceRecord record = attendanceRecordRepository.findByUserAndDate(user, targetLogicalDate)
                .orElseGet(() -> AttendanceRecord.builder().user(user).date(targetLogicalDate).build());

        if (dailyLogs.isEmpty()) {
            record.setStatus(isOnLeave ? AttendanceStatus.ON_LEAVE : AttendanceStatus.ABSENT);
            record.setLateMinutes(0);
            record.setEarlyLeaveMinutes(0);
            record.setTotalWorkingHours(0.0);
            record.setOvertimeHours(0.0);
            attendanceRecordRepository.save(record);
            return;
        }

        LocalDateTime firstIn = dailyLogs.stream().map(TimeLog::getPunchTime).min(LocalDateTime::compareTo).orElse(null);
        LocalDateTime lastOut = dailyLogs.stream().map(TimeLog::getPunchTime).max(LocalDateTime::compareTo).orElse(null);

        AttendanceStatus status = AttendanceStatus.OK;
        if (!isOnLeave && (firstIn.equals(lastOut) || Duration.between(firstIn, lastOut).toMinutes() < 30)) {
            lastOut = null;
            status = AttendanceStatus.MISSING_CHECKOUT;
        }

        record.setFirstIn(firstIn);
        record.setLastOut(lastOut);
        record.setStatus(status);

        recalculateMetrics(record);

        attendanceRecordRepository.save(record);
    }

    public void recalculateMetrics(AttendanceRecord record) {
        LocalTime shiftStart = LocalTime.of(8, 30);
        LocalTime shiftEnd = LocalTime.of(17, 30);
        LocalTime lunchStart = LocalTime.of(12, 0);
        LocalTime lunchEnd = LocalTime.of(13, 0);

        int lateMin = 0;
        int earlyMin = 0;
        double workingHours = 0.0;
        double overtimeHours = 0.0;

        if (record.getFirstIn() != null && record.getLastOut() != null) {
            LocalTime inTime = record.getFirstIn().toLocalTime();
            LocalTime outTime = record.getLastOut().toLocalTime();

            if (inTime.isAfter(shiftStart)) lateMin = (int) Duration.between(shiftStart, inTime).toMinutes();
            if (outTime.isBefore(shiftEnd)) earlyMin = (int) Duration.between(outTime, shiftEnd).toMinutes();

            if (outTime.isAfter(shiftEnd)) {
                overtimeHours = Duration.between(shiftEnd, outTime).toMinutes() / 60.0;
            }

            LocalTime effectiveIn = inTime.isBefore(shiftStart) ? shiftStart : inTime;
            LocalTime effectiveOut = outTime.isAfter(shiftEnd) ? shiftEnd : outTime;

            long validMinutes = 0;
            if (effectiveIn.isBefore(effectiveOut)) {
                validMinutes = Duration.between(effectiveIn, effectiveOut).toMinutes();
                LocalTime overlapStart = effectiveIn.isAfter(lunchStart) ? effectiveIn : lunchStart;
                LocalTime overlapEnd = effectiveOut.isBefore(lunchEnd) ? effectiveOut : lunchEnd;
                if (overlapStart.isBefore(overlapEnd)) {
                    validMinutes -= Duration.between(overlapStart, overlapEnd).toMinutes();
                }
            }
            workingHours = validMinutes / 60.0;
        }

        record.setLateMinutes(lateMin);
        record.setEarlyLeaveMinutes(earlyMin);
        record.setTotalWorkingHours(Math.round(workingHours * 10.0) / 10.0);
        record.setOvertimeHours(Math.round(overtimeHours * 10.0) / 10.0);
    }
}