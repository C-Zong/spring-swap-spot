package com.cyanzone.swapspot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyanzone.swapspot.entity.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ItemMapper extends BaseMapper<Item> {
    @Update("""
      UPDATE items
      SET quantity = quantity - #{need}
      WHERE id = #{itemId}
        AND quantity >= #{need}
        AND status = 'Active'
    """)
    int decrementStock(@Param("itemId") Long itemId, @Param("need") Integer need);

    @Update("""
      UPDATE items
      SET status = 'Sold'
      WHERE id = #{itemId}
        AND quantity = 0
    """)
    void markSoldIfZero(@Param("itemId") Long itemId);
}
