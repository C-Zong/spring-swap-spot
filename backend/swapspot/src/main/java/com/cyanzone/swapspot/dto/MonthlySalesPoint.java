package com.cyanzone.swapspot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlySalesPoint {
    private String month;
    private Long units;
    private Long revenueCents;
}
