package com.cyanzone.swapspot.dto;

public record CartRow(
        Integer userId,
        Long itemId,
        Integer cartQty,
        Integer stockQty,
        Integer sellerId,
        String sellerUsername,
        String sellerAvatarKey,
        String title,
        Integer priceCents,
        String currency,
        String coverKey
) {}
