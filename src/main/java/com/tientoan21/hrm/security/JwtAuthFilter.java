package com.tientoan21.hrm.security;

import com.tientoan21.hrm.confiig.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        if(token != null){
            try {
                String username = jwtUtils.extractUsername(token);

                //Kiểm tra username có tồn tại VÀ Request này chưa được xác thực
                if(StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null) {

                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                    if(jwtUtils.isTokenValid(token, userDetails)){
                        if (!userDetails.isAccountNonLocked()) {
                            log.warn("Tài khoản {} đã bị khóa!", username);
                            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Tài khoản đã bị khóa trong phiên đăng nhập!");
                            return;
                        }
                        log.info("Valid JWT From: {}", username);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );
                        // thêm thông tin chi tiết của Request (IP, Session Id) vào authToken
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        // Đưa đối tượng vào SecurityContextHolder để Spring Security ghi nhận đã đăng nhập
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (Exception e) {
                log.error("Lỗi xác thực JWT: {}", e.getMessage());
            }
        }
        filterChain.doFilter(request,response);
    }

    private String getTokenFromRequest(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if(StringUtils.hasText(authHeader) && StringUtils.startsWithIgnoreCase(authHeader,"Bearer ")){
            return authHeader.substring(7);
        }
        return null;
    }
}