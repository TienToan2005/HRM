package com.tientoan21.hrm.service;

import com.tientoan21.hrm.enums.ErrorCode;
import com.tientoan21.hrm.exception.AppException;
import com.tientoan21.hrm.model.RefreshToken;
import com.tientoan21.hrm.model.User;
import com.tientoan21.hrm.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(User user){
        String token = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiredAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);

    }
    public RefreshToken rotateToken(RefreshToken oldToken){
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        RefreshToken newRefreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(oldToken.getUser())
                .expiredAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(newRefreshToken);
    }
    public RefreshToken verifyToken(String token){
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED,"Refresh token does not exist."));

        if(refreshToken.isRevoked()){
            throw new AppException(ErrorCode.UNAUTHENTICATED,"The refresh token has been revoked.");
        }
        if(refreshToken.getExpiredAt().isBefore(LocalDateTime.now())){
            throw new AppException(ErrorCode.UNAUTHENTICATED,"The refresh token has expired. Please log in again.");
        }

        return refreshToken;
    }
}
