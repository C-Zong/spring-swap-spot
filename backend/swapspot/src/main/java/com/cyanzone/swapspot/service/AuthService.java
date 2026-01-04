package com.cyanzone.swapspot.service;

import com.cyanzone.swapspot.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JwtService jwtService;

    public AuthService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public void login(User user, HttpServletResponse response) {
        String token = jwtService.generateToken(
                user.getId(),
                user.getUsername()
        );

        ResponseCookie cookie = jwtService.createAuthCookie(token);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
