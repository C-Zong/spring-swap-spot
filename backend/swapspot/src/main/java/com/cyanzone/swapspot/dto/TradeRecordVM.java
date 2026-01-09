package com.cyanzone.swapspot.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class TradeRecordVM {
    private long id;

    // BUYER / SELLER
    private String role;

    private long itemId;
    private String title;

    private int quantity;
    private int unitPriceCents;
    private int totalCents;
    private String currency;

    private Instant createdAt;
}
