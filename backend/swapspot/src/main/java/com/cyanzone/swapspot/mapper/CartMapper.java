package com.cyanzone.swapspot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyanzone.swapspot.dto.CartCheckoutRow;
import com.cyanzone.swapspot.dto.CartRow;
import com.cyanzone.swapspot.entity.CartItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CartMapper extends BaseMapper<CartItem> {

    @Insert("""
            INSERT INTO cart_items(user_id, item_id, quantity)
            VALUES(#{userId}, #{itemId}, #{delta})
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
            """)
    void add(@Param("userId") int userId,
             @Param("itemId") long itemId,
             @Param("delta") int delta);

    @Select("""
            SELECT
              c.user_id AS userId,
              c.item_id AS itemId,
              c.quantity AS cartQty,
              i.quantity AS stockQty,
            
              u.id AS sellerId,
              u.username AS sellerUsername,
              u.avatar_key AS sellerAvatarKey,
            
              i.title AS title,
              i.price_cents AS priceCents,
              i.currency AS currency,
            
              img.s3_key AS coverKey
            FROM cart_items c
            JOIN items i ON i.id = c.item_id
            JOIN users u ON u.id = i.seller_id
            LEFT JOIN item_images img
              ON img.id = (
                SELECT ii.id
                FROM item_images ii
                WHERE ii.item_id = i.id
                ORDER BY ii.sort_order, ii.id
                LIMIT 1
              )
            WHERE c.user_id = #{userId}
            ORDER BY u.id, c.item_id;
            """)
    List<CartRow> selectCartRows(@Param("userId") Integer userId);

    @Select("""
      SELECT
        c.item_id     AS itemId,
        c.quantity    AS qty,
        i.seller_id   AS sellerId,
        i.price_cents AS priceCents,
        i.currency    AS currency
      FROM cart_items c
      JOIN items i ON i.id = c.item_id
      WHERE c.user_id = #{userId}
        AND i.seller_id = #{sellerId}
    """)
    List<CartCheckoutRow> selectCheckoutRowsBySeller(
            @Param("userId") Integer userId,
            @Param("sellerId") Integer sellerId
    );
}
