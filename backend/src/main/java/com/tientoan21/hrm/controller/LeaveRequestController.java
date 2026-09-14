package com.tientoan21.hrm.controller;


import com.tientoan21.hrm.dto.reponse.ApiResponse;
import com.tientoan21.hrm.dto.reponse.LeaveRequestResponse;
import com.tientoan21.hrm.dto.request.LeaveRequestRequest;
import com.tientoan21.hrm.service.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @PostMapping
    public ApiResponse<LeaveRequestResponse> createLeaveRequest(@Valid @RequestBody LeaveRequestRequest request) {
        return ApiResponse.<LeaveRequestResponse>builder()
                .message("Leave request submitted successfully")
                .data(leaveRequestService.createLeaveRequest(request))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<Page<LeaveRequestResponse>> getMyLeaveRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<LeaveRequestResponse>>builder()
                .data(leaveRequestService.getMyLeaveRequests(page, size))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'PRESIDENT')")
    public ApiResponse<Page<LeaveRequestResponse>> getAllLeaveRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<LeaveRequestResponse>>builder()
                .data(leaveRequestService.getAllLeaveRequests(page, size))
                .build();
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'PRESIDENT')")
    public ApiResponse<LeaveRequestResponse> approveLeaveRequest(@PathVariable Long id) {
        return ApiResponse.<LeaveRequestResponse>builder()
                .message("Leave request approved successfully")
                .data(leaveRequestService.approveLeaveRequest(id))
                .build();
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'PRESIDENT')")
    public ApiResponse<LeaveRequestResponse> rejectLeaveRequest(@PathVariable Long id) {
        return ApiResponse.<LeaveRequestResponse>builder()
                .message("Leave request rejected successfully")
                .data(leaveRequestService.rejectLeaveRequest(id))
                .build();
    }
}
