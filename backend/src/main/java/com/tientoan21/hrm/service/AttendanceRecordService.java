package com.tientoan21.hrm.service;

import com.tientoan21.hrm.dto.reponse.AttendanceRecordResponse;
import com.tientoan21.hrm.enums.ErrorCode;
import com.tientoan21.hrm.exception.AppException;
import com.tientoan21.hrm.mapper.AttendanceRecordMapper;
import com.tientoan21.hrm.model.User;
import com.tientoan21.hrm.repository.AttendanceRecordRepository;
import com.tientoan21.hrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AttendanceRecordService {
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final UserRepository userRepository;
    private final AttendanceRecordMapper attendanceRecordMapper;

    @Transactional(readOnly = true)
    public Page<AttendanceRecordResponse> getMyAttendanceRecord(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        User user = getCurrentUser();
        return attendanceRecordRepository.findAllByUser(user, pageable)
                .map(attendanceRecordMapper::toAttendanceRecordResponse);
    }

    @Transactional(readOnly = true)
    public Page<AttendanceRecordResponse> getAllAttendanceRecord(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return attendanceRecordRepository.findAll(pageable)
                .map(attendanceRecordMapper::toAttendanceRecordResponse);
    }

    private User getCurrentUser() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}
