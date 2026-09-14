package com.tientoan21.hrm.controller;


import com.tientoan21.hrm.dto.reponse.ApiResponse;
import com.tientoan21.hrm.dto.reponse.AttendanceRecordResponse;
import com.tientoan21.hrm.dto.request.PunchCorrectionRequest;
import com.tientoan21.hrm.dto.request.RawPunchRequest;
import com.tientoan21.hrm.service.AttendanceProcessorService;
import com.tientoan21.hrm.service.AttendanceRecordService;
import com.tientoan21.hrm.service.PunchRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceProcessorService processorService;
    private final AttendanceRecordService recordService;
    private final PunchRequestService punchRequestService;

    @PostMapping("/punch")
    public ApiResponse<Void> submitRawPunch(@Valid @RequestBody RawPunchRequest request) {
        processorService.saveRawPunchLog(request.userId(), request.punchTime());
        return ApiResponse.<Void>builder()
                .message("Punch log recorded successfully")
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<Page<AttendanceRecordResponse>> getMyAttendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<AttendanceRecordResponse>>builder()
                .data(recordService.getMyAttendanceRecord(page, size))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<Page<AttendanceRecordResponse>> getAllAttendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<AttendanceRecordResponse>>builder()
                .data(recordService.getAllAttendanceRecord(page, size))
                .build();
    }

    @PostMapping("/requests")
    public ApiResponse<Void> submitPunchRequest(@Valid @RequestBody PunchCorrectionRequest request) {
        punchRequestService.submitRequest(
                request.targetDate(),
                request.requestedInTime(),
                request.requestedOutTime(),
                request.reason()
        );
        return ApiResponse.<Void>builder()
                .message("Punch correction request submitted successfully")
                .build();
    }

    @PutMapping("/requests/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'ADMIN')")
    public ApiResponse<Void> approvePunchRequest(@PathVariable Long id) {
        punchRequestService.approveRequest(id);
        return ApiResponse.<Void>builder()
                .message("Request approved and attendance recalculated")
                .build();
    }

    @PutMapping("/requests/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'ADMIN')")
    public ApiResponse<Void> rejectPunchRequest(@PathVariable Long id) {
        punchRequestService.rejectRequest(id);
        return ApiResponse.<Void>builder()
                .message("Request rejected successfully")
                .build();
    }

    @PostMapping("/recalculate")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<Void> manualRecalculate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate targetDate) {
        processorService.manualRecalculateAttendance(targetDate);
        return ApiResponse.<Void>builder()
                .message("Manual recalculation triggered for date: " + targetDate)
                .build();
    }
}