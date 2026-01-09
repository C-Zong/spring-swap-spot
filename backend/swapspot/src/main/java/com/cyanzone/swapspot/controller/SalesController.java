package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.MonthlySalesPoint;
import com.cyanzone.swapspot.service.SalesStatsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class SalesController {

    private final SalesStatsService salesStatsService;

    public SalesController(SalesStatsService salesStatsService) {
        this.salesStatsService = salesStatsService;
    }

    @GetMapping("/{id}/sales/monthly")
    public ApiResponse<List<MonthlySalesPoint>> monthlySales(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer months
    ) {
        return ApiResponse.success(salesStatsService.monthly(id, months));
    }
}
