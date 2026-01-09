package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.dto.ListingDto;
import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.service.DiscoverService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/discover")
public class DiscoverController {

    private final DiscoverService discoverService;

    public DiscoverController(DiscoverService discoverService) {
        this.discoverService = discoverService;
    }

    @GetMapping
    public ApiResponse<List<ListingDto>> discover(
            @RequestParam(defaultValue = "36") int limit,
            @RequestParam(required = false) String q
    ) {
        if (q == null || q.isBlank()) {
            return ApiResponse.success(discoverService.discover(limit));
        }
        return ApiResponse.success(discoverService.search(q.trim(), limit));
    }
}
