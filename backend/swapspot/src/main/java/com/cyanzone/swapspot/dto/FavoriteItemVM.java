package com.cyanzone.swapspot.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class FavoriteItemVM {
    private long itemId;
    private String title;
    private int priceCents;
    private String currency;
    private Instant createdAt;
}
