package com.tientoan21.hrm.controller;

import com.tientoan21.hrm.dto.reponse.ApiResponse;
import com.tientoan21.hrm.dto.reponse.UserDetailResponse;
import com.tientoan21.hrm.dto.request.ChangePasswordRequest;
import com.tientoan21.hrm.dto.request.MyProfileRequest;
import com.tientoan21.hrm.dto.request.UserRequest;
import com.tientoan21.hrm.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ApiResponse<UserDetailResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ApiResponse.<UserDetailResponse>builder()
                .data(userService.createUser(request))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<UserDetailResponse> getMyProfile() {
        return ApiResponse.<UserDetailResponse>builder()
                .data(userService.getMyProfile())
                .build();
    }

    @PutMapping("/me")
    public ApiResponse<UserDetailResponse> updateMyProfile(@Valid @RequestBody MyProfileRequest request) {
        return ApiResponse.<UserDetailResponse>builder()
                .data(userService.updateMyProfile(request))
                .build();
    }

    @PatchMapping("/me/password")
    public ApiResponse<String> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ApiResponse.<String>builder()
                .data("Đổi mật khẩu thành công")
                .build();
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'MANAGER', 'PRESIDENT')")
    public ApiResponse<Page<UserDetailResponse>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.<Page<UserDetailResponse>>builder()
                .data(userService.searchUsers(keyword, departmentId, page, size))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR', 'MANAGER', 'PRESIDENT')")
    public ApiResponse<UserDetailResponse> getUser(@PathVariable Long id) {
        return ApiResponse.<UserDetailResponse>builder()
                .data(userService.getUser(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ApiResponse<UserDetailResponse> updateUsers(@PathVariable Long id,
                                                       @Valid @RequestBody UserRequest request) {
        return ApiResponse.<UserDetailResponse>builder()
                .data(userService.updateUsers(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ApiResponse<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.<String>builder()
                .data("Xoá nhân viên thành công")
                .build();
    }
}