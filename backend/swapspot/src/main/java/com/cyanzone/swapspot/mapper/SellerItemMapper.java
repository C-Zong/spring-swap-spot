package com.cyanzone.swapspot.mapper;

import com.cyanzone.swapspot.dto.SellerItemCardRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SellerItemMapper {
    List<SellerItemCardRow> listSellerActiveItems(@Param("sellerId") Integer sellerId,
                                                  @Param("status") String status,
                                                  @Param("limit") Integer limit);
}
