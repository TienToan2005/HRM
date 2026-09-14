package com.tientoan21.hrm.controller;

import com.tientoan21.hrm.dto.reponse.ApiResponse;
import com.tientoan21.hrm.dto.reponse.RegisterResponse;
import com.tientoan21.hrm.dto.reponse.TokenResponse;
import com.tientoan21.hrm.dto.request.LoginRequest;
import com.tientoan21.hrm.dto.request.RegisterRequest;
import com.tientoan21.hrm.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('HR')")
    public ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.<RegisterResponse>builder()
                .data(authService.register(request))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request,
                                            HttpServletResponse response) {
        return ApiResponse.<TokenResponse>builder()
                .data(authService.login(request, response))
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        return ApiResponse.<TokenResponse>builder()
                .data(authService.refreshToken(refreshToken, response))
                .build();
    }

    @PostMapping("/refresh/logout")
    public ApiResponse<String> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        authService.logout(refreshToken, response);
        return ApiResponse.<String>builder()
                .data("Đăng xuất thành công")
                .build();
    }
}