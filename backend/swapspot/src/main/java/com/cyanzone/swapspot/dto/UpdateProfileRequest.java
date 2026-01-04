package com.cyanzone.swapspot.dto;

public record UpdateProfileRequest(
        String headline,
        String bio,
        String avatarKey
) {}
