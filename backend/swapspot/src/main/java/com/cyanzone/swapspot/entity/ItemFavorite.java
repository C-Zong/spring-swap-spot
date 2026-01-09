package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("item_favorites")
public class ItemFavorite {

    @TableId
    private Long itemId;

    private Integer userId;
}
