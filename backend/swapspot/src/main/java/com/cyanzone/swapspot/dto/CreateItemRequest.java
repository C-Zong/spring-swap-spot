package com.cyanzone.swapspot.dto;

import java.util.List;

public record CreateItemRequest(
        String title,
        Integer priceCents,
        String description,

        String category,
        String condition,
        String tradeMethod,
        String location,

        List<String> tags,
        Integer quantity,
        Boolean negotiable,
        String status,

        List<String> imageKeys
) {}
