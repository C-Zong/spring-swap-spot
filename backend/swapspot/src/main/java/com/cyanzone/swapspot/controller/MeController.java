package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.FavoriteItemVM;
import com.cyanzone.swapspot.dto.MeResponse;
import com.cyanzone.swapspot.dto.TradeRecordVM;
import com.cyanzone.swapspot.entity.User;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.UserMapper;
import com.cyanzone.swapspot.service.CurrentUserService;
import com.cyanzone.swapspot.service.MeFavoritesService;
import com.cyanzone.swapspot.service.MeTradesService;
import com.cyanzone.swapspot.service.S3Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final UserMapper userMapper;
    private final CurrentUserService currentUserService;
    private final S3Service s3Service;
    private final MeFavoritesService favoritesService;
    private final MeTradesService tradesService;

    public MeController(UserMapper userMapper,
                        CurrentUserService currentUserService,
                        S3Service s3Service,
                        MeFavoritesService meFavoritesService,
                        MeTradesService meTradesService) {
        this.userMapper = userMapper;
        this.currentUserService = currentUserService;
        this.s3Service = s3Service;
        this.favoritesService = meFavoritesService;
        this.tradesService = meTradesService;
    }

    @GetMapping
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

    @GetMapping("/favorites")
    public ApiResponse<List<FavoriteItemVM>> myFavorites(@RequestParam(required = false) Integer limit) {
        int userId = currentUserService.requireUserId();
        return ApiResponse.success(favoritesService.list(userId, limit));
    }

    @DeleteMapping("/favorites/{itemId}")
    public ApiResponse<Void> removeFavorite(@PathVariable long itemId) {
        int userId = currentUserService.requireUserId();
        favoritesService.remove(userId, itemId);
        return ApiResponse.success();
    }

    @GetMapping("/trades")
    public ApiResponse<List<TradeRecordVM>> myTrades(@RequestParam(required = false) Integer limit) {
        int userId = currentUserService.requireUserId();
        return ApiResponse.success(tradesService.list(userId, limit));
    }
}
