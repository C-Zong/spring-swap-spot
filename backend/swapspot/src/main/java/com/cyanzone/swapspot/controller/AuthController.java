package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.LoginRequest;
import com.cyanzone.swapspot.dto.SignupRequest;
import com.cyanzone.swapspot.entity.User;
import com.cyanzone.swapspot.service.AuthService;
import com.cyanzone.swapspot.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ApiResponse<Void> signup(
            @Valid @RequestBody SignupRequest request,
            HttpServletResponse response) {

        User user = userService.register(
                request.getUsername(),
                request.getPassword()
        );
        authService.login(user, response);
        return ApiResponse.success();
    }

    @PostMapping("/login")
    public ApiResponse<Void> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        User user = userService.authenticate(request.getUsername(), request.getPassword());
        authService.login(user, response);
        return ApiResponse.success();
    }

    @PostMapping("/logout")
    public ApiResponse<?> logout(HttpServletResponse response) {
        authService.logout(response);
        return ApiResponse.success();
    }

}
