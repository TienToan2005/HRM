package com.tientoan21.hrm.service;

import com.tientoan21.hrm.enums.AttendanceStatus;
import com.tientoan21.hrm.enums.ErrorCode;
import com.tientoan21.hrm.enums.RequestStatus;
import com.tientoan21.hrm.exception.AppException;
import com.tientoan21.hrm.model.AttendanceRecord;
import com.tientoan21.hrm.model.Department;
import com.tientoan21.hrm.model.PunchRequest;
import com.tientoan21.hrm.model.User;
import com.tientoan21.hrm.repository.AttendanceRecordRepository;
import com.tientoan21.hrm.repository.PunchRequestRepository;
import com.tientoan21.hrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PunchRequestService {
    private final PunchRequestRepository requestRepository;
    private final AttendanceRecordRepository recordRepository;
    private final AttendanceProcessorService processorService;
    private final UserRepository userRepository;

    @Transactional
    public void submitRequest(LocalDate targetDate, LocalDateTime inTime, LocalDateTime outTime, String reason) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();

        PunchRequest request = PunchRequest.builder()
                .user(user)
                .targetDate(targetDate)
                .requestedInTime(inTime)
                .requestedOutTime(outTime)
                .reason(reason)
                .status(RequestStatus.PENDING)
                .build();

        requestRepository.save(request);
    }

    @Transactional
    public void approveRequest(Long requestId) {
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        PunchRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_ALREADY_PROCESSED);
        }

        validateApprovalPermission(currentUser, request);

        request.setStatus(RequestStatus.APPROVED);
        request.setApproverId(currentUserId);

        AttendanceRecord record = recordRepository.findByUserAndDate(request.getUser(), request.getTargetDate())
                .orElseThrow(() -> new AppException(ErrorCode.RECORD_NOT_FOUND));

        if (request.getRequestedInTime() != null) record.setFirstIn(request.getRequestedInTime());
        if (request.getRequestedOutTime() != null) record.setLastOut(request.getRequestedOutTime());

        record.setStatus(AttendanceStatus.OK);

        processorService.recalculateMetrics(record);

        recordRepository.save(record);
    }

    @Transactional
    public void rejectRequest(Long requestId) {
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        PunchRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_ALREADY_PROCESSED);
        }

        validateApprovalPermission(currentUser, request);

        request.setStatus(RequestStatus.REJECTED);
        request.setApproverId(currentUserId);

        requestRepository.save(request);
    }

    private void validateApprovalPermission(User currentUser, PunchRequest request) {
        boolean isHrOrAdmin = currentUser.getRole().name().equals("HR") || currentUser.getRole().name().equals("ADMIN");

        Department department = request.getUser().getDepartment();
        boolean isDirectManager = department != null
                && department.getManager() != null
                && department.getManager().getId().equals(currentUser.getId());

        if (!isDirectManager && !isHrOrAdmin) {
            throw new AppException(ErrorCode.UNAUTHORIZED_APPROVAL);
        }
    }
}