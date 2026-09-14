package com.tientoan21.hrm.service;

import com.tientoan21.hrm.dto.reponse.LeaveRequestResponse;
import com.tientoan21.hrm.dto.request.LeaveRequestRequest;
import com.tientoan21.hrm.enums.ErrorCode;
import com.tientoan21.hrm.enums.RequestStatus;
import com.tientoan21.hrm.exception.AppException;
import com.tientoan21.hrm.mapper.LeaveRequestMapper;
import com.tientoan21.hrm.model.Department;
import com.tientoan21.hrm.model.LeaveRequest;
import com.tientoan21.hrm.model.User;
import com.tientoan21.hrm.repository.LeaveRequestRepository;
import com.tientoan21.hrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final LeaveRequestMapper leaveRequestMapper;

    @Transactional
    public LeaveRequestResponse createLeaveRequest(LeaveRequestRequest request){
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if(request.dateFrom().isAfter(request.dateTo())){
            throw new AppException(ErrorCode.INVALID_DATE_RANGE);
        }

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .dateFrom(request.dateFrom())
                .dateTo(request.dateTo())
                .reason(request.reason())
                .status(RequestStatus.PENDING)
                .user(user)
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        return leaveRequestMapper.toLeaveRequestResponse(saved);
    }
    public Page<LeaveRequestResponse> getMyLeaveRequests(int page, int size) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size);

        Page<LeaveRequest> leaveRequestPage = leaveRequestRepository.findAllByUser(user, pageable);

        return leaveRequestPage.map(leaveRequestMapper::toLeaveRequestResponse);
    }
    public Page<LeaveRequestResponse> getAllLeaveRequests(int page, int size){
        Pageable pageable = PageRequest.of(page, size);

        Page<LeaveRequest> leaveRequestPage = leaveRequestRepository.findAll(pageable);

        return leaveRequestPage.map(leaveRequestMapper::toLeaveRequestResponse);
    }

    @Transactional
    public LeaveRequestResponse approveLeaveRequest(Long id){
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));

        if (leaveRequest.getStatus() != RequestStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        validateApprovalPermission(currentUser, leaveRequest);

        leaveRequest.setStatus(RequestStatus.APPROVED);
        leaveRequest.setReviewerId(currentUserId);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        return leaveRequestMapper.toLeaveRequestResponse(saved);
    }
    @Transactional
    public LeaveRequestResponse rejectLeaveRequest(Long id){
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));

        if (leaveRequest.getStatus() != RequestStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        validateApprovalPermission(currentUser, leaveRequest);

        leaveRequest.setStatus(RequestStatus.REJECTED);
        leaveRequest.setReviewerId(currentUserId);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        return leaveRequestMapper.toLeaveRequestResponse(saved);
    }
    private void validateApprovalPermission(User currentUser, LeaveRequest leaveRequest) {
        boolean isHrOrAdmin = currentUser.getRole().name().equals("HR") || currentUser.getRole().name().equals("ADMIN");
        Department department = leaveRequest.getUser().getDepartment();
        boolean isDirectManager = department != null
                && department.getManager() != null
                && department.getManager().getId().equals(currentUser.getId());

        if (!isDirectManager && !isHrOrAdmin) {
            throw new AppException(ErrorCode.UNAUTHORIZED_APPROVAL);
        }
    }

}
