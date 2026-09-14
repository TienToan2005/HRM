package com.tientoan21.hrm.controller;

import com.tientoan21.hrm.dto.reponse.ApiResponse;
import com.tientoan21.hrm.dto.reponse.SalaryResponse;
import com.tientoan21.hrm.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/salaries")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping("/me")
    public ApiResponse<SalaryResponse> getMySalary(
            @RequestParam int month,
            @RequestParam int year) {
        return ApiResponse.<SalaryResponse>builder()
                .data(salaryService.getMySalary(month, year))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<Page<SalaryResponse>> getAllSalary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam int month,
            @RequestParam int year) {
        return ApiResponse.<Page<SalaryResponse>>builder()
                .data(salaryService.getAllSalary(page, size, month, year))
                .build();
    }

    @PostMapping("/generate/{userId}")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<SalaryResponse> generatePaycheck(
            @PathVariable Long userId,
            @RequestParam int month,
            @RequestParam int year) {
        return ApiResponse.<SalaryResponse>builder()
                .message("Paycheck generated successfully for user ID: " + userId)
                .data(salaryService.generatePaycheck(userId, month, year))
                .build();
    }

    @PostMapping("/generate-all")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<Void> generatePaycheckForAll(
            @RequestParam int month,
            @RequestParam int year) {
        salaryService.generatePaycheckForAll(month, year);
        return ApiResponse.<Void>builder()
                .message(String.format("Batch payroll generation triggered for %02d/%d", month, year))
                .build();
    }

    @PutMapping("/{salaryId}/pay")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<SalaryResponse> paySalary(@PathVariable Long salaryId) {
        return ApiResponse.<SalaryResponse>builder()
                .message("Salary marked as PAID successfully")
                .data(salaryService.paySalary(salaryId))
                .build();
    }
}