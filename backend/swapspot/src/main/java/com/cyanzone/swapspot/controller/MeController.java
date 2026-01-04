package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.MeResponse;
import com.cyanzone.swapspot.entity.User;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.UserMapper;
import com.cyanzone.swapspot.service.CurrentUserService;
import com.cyanzone.swapspot.service.S3Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MeController {

    private final UserMapper userMapper;
    private final CurrentUserService currentUserService;
    private final S3Service s3Service;

    public MeController(UserMapper userMapper, CurrentUserService currentUserService, S3Service s3Service) {
        this.userMapper = userMapper;
        this.currentUserService = currentUserService;
        this.s3Service = s3Service;
    }

    @GetMapping("/me")
    public ApiResponse<MeResponse> me() {
        Integer userId = currentUserService.requireUserId();

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(404, "User not found");
        }

        String avatarUrl = null;
        if (user.getAvatarKey() != null && !user.getAvatarKey().isBlank()) {
            avatarUrl = s3Service.presignGetUrl(user.getAvatarKey());
        }

        return ApiResponse.success(
                new MeResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getHeadline(),
                        user.getBio(),
                        user.getAvatarKey(),
                        avatarUrl
                )
        );
    }
}
