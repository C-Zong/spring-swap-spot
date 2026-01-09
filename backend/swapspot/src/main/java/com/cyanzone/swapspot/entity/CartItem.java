package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("cart_items")
public class CartItem {
    private Integer userId;
    private Long itemId;
    private Integer quantity;
    private Instant createdAt;
    private Instant updatedAt;
}
