package com.cyanzone.swapspot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class SellerItemCard {
    private Long id;
    private String title;
    private Integer priceCents;
    private String currency;
    private String location;
    private Boolean negotiable;
    private Integer quantity;
    private String coverUrl;
    private Instant updatedAt;
}
