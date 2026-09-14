package com.tientoan21.hrm.controller;

import com.tientoan21.hrm.dto.reponse.ApiResponse;
import com.tientoan21.hrm.dto.reponse.DepartmentResponse;
import com.tientoan21.hrm.dto.request.DepartmentRequest;
import com.tientoan21.hrm.dto.request.UpdateDepartmentRequest;
import com.tientoan21.hrm.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        return ApiResponse.<DepartmentResponse>builder()
                .message("Department created successfully")
                .data(departmentService.createDepartment(request))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<DepartmentResponse>> searchDepartments(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<DepartmentResponse>>builder()
                .data(departmentService.searchDepartment(keyword, page, size))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<DepartmentResponse> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDepartmentRequest request) {
        return ApiResponse.<DepartmentResponse>builder()
                .message("Department updated successfully")
                .data(departmentService.updateDepartment(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ApiResponse<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ApiResponse.<Void>builder()
                .message("Department deleted successfully")
                .build();
    }
}