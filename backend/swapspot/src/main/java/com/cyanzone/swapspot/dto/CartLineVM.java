package com.cyanzone.swapspot.dto;

public record CartLineVM(
        Long itemId,
        String title,
        Integer priceCents,
        String currency,
        Integer qty,
        Integer availableQty,
        String coverUrl
) {}