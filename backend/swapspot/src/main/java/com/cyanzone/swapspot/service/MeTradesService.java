package com.cyanzone.swapspot.service;

import com.cyanzone.swapspot.mapper.MeTradesMapper;
import com.cyanzone.swapspot.dto.TradeRecordVM;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeTradesService {

    private final MeTradesMapper mapper;

    public MeTradesService(MeTradesMapper mapper) {
        this.mapper = mapper;
    }

    public List<TradeRecordVM> list(int userId, Integer limit) {
        int n = (limit == null ? 5 : Math.max(1, Math.min(limit, 50)));
        return mapper.listTrades(userId, n);
    }
}
