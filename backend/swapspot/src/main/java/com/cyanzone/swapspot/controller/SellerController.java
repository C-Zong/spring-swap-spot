package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.SellerItemCard;
import com.cyanzone.swapspot.service.SellerItemListService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class SellerController {

    private final SellerItemListService sellerItemListService;

    public SellerController(SellerItemListService sellerItemListService) {
        this.sellerItemListService = sellerItemListService;
    }

    @GetMapping("/{id}/items")
    public ApiResponse<List<SellerItemCard>> listSellerItems(
            @PathVariable Integer id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer limit
    ) {
        return ApiResponse.success(sellerItemListService.listSellerItems(id, status, limit));
    }
}
