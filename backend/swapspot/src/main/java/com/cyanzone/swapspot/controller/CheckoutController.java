package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.service.CheckoutService;
import com.cyanzone.swapspot.service.CurrentUserService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

  private final CheckoutService checkoutService;
  private final CurrentUserService currentUserService;

  public CheckoutController(CheckoutService checkoutService, CurrentUserService currentUserService) {
    this.checkoutService = checkoutService;
    this.currentUserService = currentUserService;
  }

  @PostMapping("/seller/{sellerId}")
  public ApiResponse<Void> checkoutSeller(@PathVariable Integer sellerId) {
    Integer buyerId = currentUserService.requireUserId();
    checkoutService.checkoutSeller(buyerId, sellerId);
    return ApiResponse.success(null);
  }
}