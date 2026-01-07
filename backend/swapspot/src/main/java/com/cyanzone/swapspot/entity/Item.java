package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@TableName("items")
public class Item {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Integer sellerId;

    private String title;
    private String description;

    private Integer priceCents;
    private String currency;

    private String category;
    private String itemCondition;
    private String tradeMethod;

    private String location;

    private String tagsJson;
    private Integer quantity;
    private Boolean negotiable;

    private String status;

    private Instant createdAt;
    private Instant updatedAt;
}