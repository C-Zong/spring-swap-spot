package com.cyanzone.swapspot.dto;

import java.time.Instant;

public record MyItemRow(
        Long id,
        String title,
        Integer priceCents,
        String currency,
        String status,
        Instant updatedAt
) {}
