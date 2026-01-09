package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("purchase_records")
public class PurchaseRecord {
  @TableId(type = IdType.AUTO)
  private Long id;

  private Integer buyerId;
  private Integer sellerId;

  private Long itemId;
  private Integer quantity;

  private Integer priceCents;
  private String currency;

  private Instant createdAt;
}