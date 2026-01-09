package com.cyanzone.swapspot.mapper;

import com.cyanzone.swapspot.dto.FavoriteItemVM;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MeFavoritesMapper {

    @Select("""
        SELECT
          f.item_id AS itemId,
          i.title AS title,
          i.price_cents AS priceCents,
          i.currency AS currency,
          f.created_at AS createdAt
        FROM item_favorites f
        JOIN items i ON i.id = f.item_id
        WHERE f.user_id = #{userId}
        ORDER BY f.created_at DESC
        LIMIT #{limit}
    """)
    List<FavoriteItemVM> listFavorites(@Param("userId") int userId, @Param("limit") int limit);

    @Delete("""
        DELETE FROM item_favorites
        WHERE user_id = #{userId} AND item_id = #{itemId}
    """)
    void deleteFavorite(@Param("userId") int userId, @Param("itemId") long itemId);
}
