package com.cyanzone.swapspot.dto;

import java.time.Instant;
import java.util.List;

public record ItemDetailResponse(
        Long id,
        Integer sellerId,
        String title,
        String description,
        Integer priceCents,
        String currency,

        String category,
        String condition,
        String tradeMethod,
        String location,

        List<String> tags,
        Integer quantity,
        Boolean negotiable,
        String status,

        List<ItemImageDto> images,

        Instant createdAt,
        Instant updatedAt,

        SellerDto seller,
        Boolean viewerIsSeller
) {
    public record ItemImageDto(String key, Integer sortOrder) {}
}
