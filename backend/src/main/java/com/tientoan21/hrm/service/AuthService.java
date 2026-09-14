package com.tientoan21.hrm.service;

import com.tientoan21.hrm.confiig.CustomUserDetails;
import com.tientoan21.hrm.confiig.JwtUtils;
import com.tientoan21.hrm.dto.reponse.RegisterResponse;
import com.tientoan21.hrm.dto.reponse.TokenResponse;
import com.tientoan21.hrm.dto.request.LoginRequest;
import com.tientoan21.hrm.dto.request.RegisterRequest;
import com.tientoan21.hrm.enums.ErrorCode;
import com.tientoan21.hrm.enums.UserRole;
import com.tientoan21.hrm.exception.AppException;
import com.tientoan21.hrm.mapper.UserMapper;
import com.tientoan21.hrm.model.RefreshToken;
import com.tientoan21.hrm.model.User;
import com.tientoan21.hrm.repository.RefreshTokenRepository;
import com.tientoan21.hrm.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.cookie.secure}")
    private boolean isCookieSecure;

    @Transactional(rollbackFor = Exception.class)
    public RegisterResponse register(RegisterRequest request){
        if(userRepository.findByEmail(request.email()).isPresent()){
            throw new AppException(ErrorCode.USER_EXISTS);
        }
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber())
                .birthday(request.birthday())
                .address(request.address())
                .role(UserRole.valueOf(request.role()))
                .build();

        User saved = userRepository.save(user);
        return userMapper.toRegisterResponse(saved);
    }
    public TokenResponse login(LoginRequest request, HttpServletResponse response){
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if(!passwordEncoder.matches(request.password(), user.getPassword())){
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        var userDetails = new CustomUserDetails(user);
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());

        var accessToken = jwtUtils.generateAccessToken(claims, userDetails);
        var refreshToken = refreshTokenService.createRefreshToken(user);
        ResponseCookie cookie = buildRefreshTokenCookie(refreshToken.getToken(),7 * 24 * 60 * 60);
        response.addHeader(HttpHeaders.SET_COOKIE,cookie.toString());

        return TokenResponse.builder()
                .accessToken(accessToken)
                .authenticated(true)
                .build();
    }
    @Transactional
    public void logout(String refreshToken, HttpServletResponse response) {
        if (refreshToken != null) {
            refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            });
        }
        ResponseCookie deleteCookie = buildRefreshTokenCookie("", 0);
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }
    @Transactional
    public TokenResponse refreshToken(String token, HttpServletResponse response) {
        RefreshToken oldToken = refreshTokenService.verifyToken(token);
        RefreshToken newRefreshToken = refreshTokenService.rotateToken(oldToken);

        User user = oldToken.getUser();
        var userDetails = new CustomUserDetails(user);
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        String newAccessToken = jwtUtils.generateAccessToken(claims,userDetails);

        ResponseCookie cookie = buildRefreshTokenCookie(newRefreshToken.getToken(), 7 * 24 * 60 * 60);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .authenticated(true)
                .build();
    }
    private ResponseCookie buildRefreshTokenCookie(String token, long maxAgeInSeconds) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(isCookieSecure)
                .path("/api/v1/auth")
                .maxAge(maxAgeInSeconds)
                .sameSite("Lax") // Dùng Lax để hoạt động đúng khi dev với port khác nhau
                .build();
    }
}
