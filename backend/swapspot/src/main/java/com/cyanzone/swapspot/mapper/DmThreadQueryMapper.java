package com.cyanzone.swapspot.mapper;

import com.cyanzone.swapspot.dto.DmMessageRow;
import com.cyanzone.swapspot.dto.DmThreadRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DmThreadQueryMapper {
  List<DmThreadRow> listThreads(@Param("uid") Integer uid);
  List<DmMessageRow> listMessages(@Param("threadId") Long threadId,
                                  @Param("clearedBefore") Long clearedBefore,
                                  @Param("beforeId") Long beforeId,
                                  @Param("limit") int limit);
  Long getLatestMsgId(@Param("threadId") Long threadId,
                      @Param("clearedBefore") Long clearedBefore);
}