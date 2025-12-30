package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.LoginRequest;
import com.cyanzone.swapspot.dto.SignupRequest;
import com.cyanzone.swapspot.entity.User;
import com.cyanzone.swapspot.service.JwtService;
import com.cyanzone.swapspot.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService,  JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ApiResponse<Void> signup(
            @Valid @RequestBody SignupRequest request) {

        userService.register(
                request.getUsername(),
                request.getPassword()
        );

        return ApiResponse.success();
    }

    @PostMapping("/login")
    public ApiResponse<Void> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        User user = userService.authenticate(request.getUsername(), request.getPassword());
        String token = jwtService.generateToken(user.getId(), user.getUsername());
        ResponseCookie cookie = jwtService.createAuthCookie(token);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ApiResponse.success();
    }

}
