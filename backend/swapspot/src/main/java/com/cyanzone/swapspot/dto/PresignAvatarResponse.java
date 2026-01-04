package com.cyanzone.swapspot.dto;

public record PresignAvatarResponse(
        String uploadUrl,
        String key
) {}