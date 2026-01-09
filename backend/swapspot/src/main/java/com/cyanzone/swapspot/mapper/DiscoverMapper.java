package com.cyanzone.swapspot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyanzone.swapspot.dto.DiscoverRow;
import com.cyanzone.swapspot.entity.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DiscoverMapper extends BaseMapper<Item> {

    @Select("""
      WITH cover AS (
        SELECT item_id, s3_key
        FROM (
          SELECT
            item_id,
            s3_key,
            ROW_NUMBER() OVER (PARTITION BY item_id ORDER BY sort_order, id) rn
          FROM item_images
        ) t
        WHERE t.rn = 1
      ),
      fav AS (
        SELECT item_id, COUNT(*) fav_cnt
        FROM item_favorites
        GROUP BY item_id
      )
      SELECT
        i.id,
        i.title,
        i.price_cents AS priceCents,
        i.currency,
        i.status,
        i.updated_at AS updatedAt,
        c.s3_key AS coverKey,
        CASE
          WHEN #{userId} IS NULL THEN 0
          ELSE EXISTS(
            SELECT 1 FROM item_favorites ff
            WHERE ff.user_id = #{userId} AND ff.item_id = i.id
          )
        END AS favored
      FROM items i
      LEFT JOIN cover c ON c.item_id = i.id
      LEFT JOIN fav f ON f.item_id = i.id
      WHERE i.status = 'Active'
      ORDER BY COALESCE(f.fav_cnt, 0) DESC, i.updated_at DESC
      LIMIT #{limit}
    """)
    List<DiscoverRow> selectDiscoverRows(@Param("limit") int limit,
                                         @Param("userId") Integer userId);

    @Select("""
      WITH cover AS (
        SELECT item_id, s3_key
        FROM (
          SELECT
            item_id,
            s3_key,
            ROW_NUMBER() OVER (PARTITION BY item_id ORDER BY sort_order, id) rn
          FROM item_images
        ) t
        WHERE t.rn = 1
      ),
      fav AS (
        SELECT item_id, COUNT(*) fav_cnt
        FROM item_favorites
        GROUP BY item_id
      )
      SELECT
        i.id,
        i.title,
        i.price_cents AS priceCents,
        i.currency,
        i.status,
        i.updated_at AS updatedAt,
        c.s3_key AS coverKey,
        CASE
          WHEN #{userId} IS NULL THEN FALSE
          ELSE EXISTS(
            SELECT 1 FROM item_favorites ff
            WHERE ff.user_id = #{userId} AND ff.item_id = i.id
          )
        END AS favored
      FROM items i
      LEFT JOIN cover c ON c.item_id = i.id
      LEFT JOIN fav f ON f.item_id = i.id
      WHERE i.status = 'Active'
        AND (
          i.title LIKE CONCAT('%', #{q}, '%')
          OR i.description LIKE CONCAT('%', #{q}, '%')
          OR i.location LIKE CONCAT('%', #{q}, '%')
        )
      ORDER BY
        (
          CASE WHEN i.title LIKE CONCAT('%', #{q}, '%') THEN 3 ELSE 0 END
          + CASE WHEN i.description LIKE CONCAT('%', #{q}, '%') THEN 1 ELSE 0 END
          + CASE WHEN i.location LIKE CONCAT('%', #{q}, '%') THEN 1 ELSE 0 END
        ) DESC,
        COALESCE(f.fav_cnt, 0) DESC,
        i.updated_at DESC
      LIMIT #{limit}
    """)
    List<DiscoverRow> selectSearchRows(@Param("limit") int limit,
                                       @Param("userId") Integer userId,
                                       @Param("q") String q);
}
