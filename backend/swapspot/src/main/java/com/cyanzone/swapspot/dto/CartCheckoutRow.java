package com.cyanzone.swapspot.dto;

public record CartCheckoutRow(
    Long itemId,
    Integer qty,
    Integer sellerId,
    Integer priceCents,
    String currency
) {}
