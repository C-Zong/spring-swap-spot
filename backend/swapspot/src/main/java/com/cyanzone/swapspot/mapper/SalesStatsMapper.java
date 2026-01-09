package com.cyanzone.swapspot.mapper;

import com.cyanzone.swapspot.dto.MonthlySalesPoint;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SalesStatsMapper {
    List<MonthlySalesPoint> monthlySales(@Param("sellerId") Integer sellerId,
                                         @Param("months") Integer months);
}
