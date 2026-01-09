package com.cyanzone.swapspot.controller;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.CartSellerVM;
import com.cyanzone.swapspot.entity.CartItem;
import com.cyanzone.swapspot.mapper.CartMapper;
import com.cyanzone.swapspot.service.CartService;
import com.cyanzone.swapspot.service.CurrentUserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CurrentUserService currentUserService;
    private final CartService cartService;
    private final CartMapper cartMapper;

    public CartController(CurrentUserService currentUserService,
                          CartService cartService,
                          CartMapper cartMapper) {
        this.currentUserService = currentUserService;
        this.cartService = cartService;
        this.cartMapper = cartMapper;
    }

    public record AddCartReq(Long itemId, Integer quantity) {}

    @PostMapping("/add")
    public ApiResponse<Void> add(@RequestBody AddCartReq req) {
        int userId = currentUserService.requireUserId();
        int qty = (req.quantity() == null || req.quantity() <= 0)
                ? 1
                : req.quantity();
        cartService.add(userId, req.itemId(), qty);
        return ApiResponse.success(null);
    }

    @GetMapping
    public ApiResponse<List<CartSellerVM>> getCart() {
        Integer userId = currentUserService.requireUserId();
        return ApiResponse.success(cartService.getCartGroupedNormalized(userId));
    }

    @DeleteMapping("/{itemId}")
    public ApiResponse<Void> remove(@PathVariable Long itemId) {
        Integer userId = currentUserService.requireUserId();
        cartService.remove(userId, itemId);
        return ApiResponse.success(null);
    }

    @PatchMapping("/{itemId}")
    public ApiResponse<Void> updateQty(@PathVariable Long itemId, @RequestParam int qty) {
        Integer userId = currentUserService.requireUserId();
        int clamped = Math.max(1, qty);
        cartMapper.update(null, new LambdaUpdateWrapper<CartItem>()
                .eq(CartItem::getUserId, userId)
                .eq(CartItem::getItemId, itemId)
                .set(CartItem::getQuantity, clamped));

        return ApiResponse.success(null);
    }
}
