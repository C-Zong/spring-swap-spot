package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.*;
import com.cyanzone.swapspot.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final ItemQueryService itemQueryService;
    private final ItemListService itemListService;
    private final ItemWriteService itemWriteService;

    public ItemController(ItemService itemService, ItemQueryService itemQueryService, ItemListService itemListService, ItemWriteService itemWriteService) {
        this.itemService = itemService;
        this.itemQueryService = itemQueryService;
        this.itemListService = itemListService;
        this.itemWriteService = itemWriteService;
    }

    @PostMapping
    public ApiResponse<CreateItemResponse> create(@RequestBody CreateItemRequest req) {
        Long id = itemService.create(req);
        return ApiResponse.success(new CreateItemResponse(id));
    }

    @GetMapping("/{id}")
    public ApiResponse<ItemDetailResponse> getById(@PathVariable Long id) {
        ItemDetailResponse data = itemQueryService.getById(id);
        return ApiResponse.success(data);
    }

    @GetMapping("/mine")
    public ApiResponse<List<MyItemRow>> listMine() {
        return ApiResponse.success(itemListService.listMyItems());
    }

    @PatchMapping("/{id}")
    public ApiResponse<Void> patch(@PathVariable Long id, @RequestBody PatchItemRequest req) {
        itemWriteService.updateItem(id, req);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        itemWriteService.deleteMyItem(id);
        return ApiResponse.success(null);
    }
}
