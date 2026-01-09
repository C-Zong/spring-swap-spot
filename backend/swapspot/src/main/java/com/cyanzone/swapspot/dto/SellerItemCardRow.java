package com.cyanzone.swapspot.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class SellerItemCardRow {
    private Long id;
    private String title;
    private Integer priceCents;
    private String currency;
    private String location;
    private Boolean negotiable;
    private Integer quantity;
    private String coverKey;
    private Instant updatedAt;
}
