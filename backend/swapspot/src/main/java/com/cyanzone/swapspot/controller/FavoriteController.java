package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.service.CurrentUserService;
import com.cyanzone.swapspot.service.FavoriteService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class FavoriteController {

    private final CurrentUserService currentUserService;
    private final FavoriteService favoriteService;

    public FavoriteController(CurrentUserService currentUserService,
                              FavoriteService favoriteService) {
        this.currentUserService = currentUserService;
        this.favoriteService = favoriteService;
    }

    @PostMapping("/api/items/{id}/favorite")
    public ApiResponse<Map<String, Object>> toggle(@PathVariable long id) {
        int userId = currentUserService.requireUserId();
        boolean favored = favoriteService.toggle(userId, id);
        return ApiResponse.success(Map.of("favored", favored));
    }
}
