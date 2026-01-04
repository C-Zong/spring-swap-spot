package com.cyanzone.swapspot.dto;

public record PresignAvatarRequest(
        String userId,
        String contentType
) {}