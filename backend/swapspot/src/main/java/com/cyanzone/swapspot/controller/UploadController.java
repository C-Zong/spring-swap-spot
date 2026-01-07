package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.*;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.service.CurrentUserService;
import com.cyanzone.swapspot.service.S3Service;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final S3Service s3Service;
    private final CurrentUserService currentUserService;

    private static final Set<String> ALLOWED = Set.of(
            "image/png", "image/jpeg", "image/webp"
    );

    public UploadController(S3Service s3Service,  CurrentUserService currentUserService) {
        this.s3Service = s3Service;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/avatar/presign")
    public ApiResponse<PresignAvatarResponse> presignAvatar(@RequestBody PresignAvatarRequest req) {
        if (req.userId() == null || req.userId().isBlank()) {
            throw new BusinessException(400, "userId required");
        }
        if (req.contentType() == null || !ALLOWED.contains(req.contentType())) {
            throw new BusinessException(400, "unsupported contentType");
        }

        String ext = switch (req.contentType()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };

        String key = "users/" + req.userId() + "/avatar/" + UUID.randomUUID() + ext;
        String uploadUrl = s3Service.presignPutUrl(key, req.contentType());

        return ApiResponse.success(new PresignAvatarResponse(uploadUrl, key));
    }

    @GetMapping("/avatar/url")
    public ApiResponse<AvatarUrlResponse> presignAvatarGetUrl(@RequestParam String key) {
        if (key == null || key.isBlank()) {
            throw new BusinessException(400, "key required");
        }

        if (!key.startsWith("users/")) {
            throw new BusinessException(400, "invalid key");
        }

        String url = s3Service.presignGetUrl(key);
        return ApiResponse.success(new AvatarUrlResponse(url));
    }

    @PostMapping("/item-images/presign")
    public ApiResponse<PresignItemImageResponse> presignItemImages(@RequestBody PresignItemImageRequest req) {
        if (req.contentType() == null || !ALLOWED.contains(req.contentType())) {
            throw new BusinessException(400, "unsupported contentType");
        }

        Integer userId = currentUserService.requireUserId();

        String ext = switch (req.contentType()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };

        String key = "tmp/items/" + userId + "/" + UUID.randomUUID() + ext;
        String uploadUrl = s3Service.presignPutUrl(key, req.contentType());

        return ApiResponse.success(new PresignItemImageResponse(uploadUrl, key));
    }

    @GetMapping("/item-images/url")
    public ApiResponse<ItemImageUrlResponse> presignItemImageGetUrl(@RequestParam String key) {
        if (key == null || key.isBlank()) {
            throw new BusinessException(400, "key required");
        }

        if (!key.startsWith("tmp/items/") && !key.startsWith("items/")) {
            throw new BusinessException(400, "invalid key");
        }

        String url = s3Service.presignGetUrl(key);
        return ApiResponse.success(new ItemImageUrlResponse(url));
    }
}
