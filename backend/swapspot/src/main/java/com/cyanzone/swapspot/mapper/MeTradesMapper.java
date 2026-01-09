package com.cyanzone.swapspot.mapper;

import com.cyanzone.swapspot.dto.TradeRecordVM;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MeTradesMapper {

    @Select("""
        SELECT
          p.id AS id,
          CASE WHEN p.buyer_id = #{userId} THEN 'BUYER' ELSE 'SELLER' END AS role,
          p.item_id AS itemId,
          i.title AS title,
          p.quantity AS quantity,
          p.price_cents AS unitPriceCents,
          (p.price_cents * p.quantity) AS totalCents,
          p.currency AS currency,
          p.created_at AS createdAt
        FROM purchase_records p
        JOIN items i ON i.id = p.item_id
        WHERE p.buyer_id = #{userId} OR p.seller_id = #{userId}
        ORDER BY p.created_at DESC
        LIMIT #{limit}
    """)
    List<TradeRecordVM> listTrades(@Param("userId") int userId, @Param("limit") int limit);
}
