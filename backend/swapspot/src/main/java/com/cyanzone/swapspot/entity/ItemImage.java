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
@TableName("item_images")
public class ItemImage {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long itemId;

    private String s3Key;

    private Integer sortOrder;

    private Instant createdAt;
}