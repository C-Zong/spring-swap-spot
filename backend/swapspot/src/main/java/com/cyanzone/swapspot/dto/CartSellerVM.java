package com.cyanzone.swapspot.dto;

import java.util.List;

public record CartSellerVM(
        Integer sellerId,
        String sellerUsername,
        String sellerAvatarUrl,
        List<CartLineVM> lines
) {}