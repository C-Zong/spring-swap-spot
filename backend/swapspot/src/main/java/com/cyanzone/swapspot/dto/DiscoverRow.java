package com.cyanzone.swapspot.dto;

import java.time.Instant;

public record DiscoverRow(
        Long id,
        String title,
        Integer priceCents,
        String currency,
        String status,
        Instant updatedAt,
        String coverKey,
        Integer favored
) {
}