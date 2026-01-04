package com.cyanzone.swapspot.dto;

public record MeResponse(
        Integer id,
        String username,
        String headline,
        String bio,
        String avatarKey,
        String avatarUrl
) {}
