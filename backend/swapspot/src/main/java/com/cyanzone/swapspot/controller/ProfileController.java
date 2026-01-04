package com.cyanzone.swapspot.controller;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.UpdateProfileRequest;
import com.cyanzone.swapspot.entity.User;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.UserMapper;
import com.cyanzone.swapspot.service.CurrentUserService;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserMapper userMapper;
    private final CurrentUserService currentUserService;

    public ProfileController(UserMapper userMapper, CurrentUserService currentUserService) {
        this.userMapper = userMapper;
        this.currentUserService = currentUserService;
    }

    @PatchMapping
    public ApiResponse<Void> updateProfile(@RequestBody UpdateProfileRequest req) {
        int userId = currentUserService.requireUserId();

        LambdaUpdateWrapper<User> uw = new LambdaUpdateWrapper<User>()
                .eq(User::getId, userId);

        if (req.headline() != null) uw.set(User::getHeadline, req.headline());
        if (req.bio() != null) uw.set(User::getBio, req.bio());
        if (req.avatarKey() != null) uw.set(User::getAvatarKey, req.avatarKey());

        if (uw.getSqlSet() == null) {
            return ApiResponse.success();
        }

        int rows = userMapper.update(null, uw);
        if (rows == 0) {
            throw new BusinessException(404, "User not found");
        }

        return ApiResponse.success();
    }
}
