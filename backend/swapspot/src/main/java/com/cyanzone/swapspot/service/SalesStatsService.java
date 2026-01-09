package com.cyanzone.swapspot.service;

import com.cyanzone.swapspot.dto.MonthlySalesPoint;
import com.cyanzone.swapspot.mapper.SalesStatsMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesStatsService {

    private final SalesStatsMapper salesStatsMapper;

    public SalesStatsService(SalesStatsMapper salesStatsMapper) {
        this.salesStatsMapper = salesStatsMapper;
    }

    public List<MonthlySalesPoint> monthly(Integer sellerId, Integer months) {
        int m = (months == null || months <= 0) ? 12 : Math.min(months, 36);
        return salesStatsMapper.monthlySales(sellerId, m);
    }
}
