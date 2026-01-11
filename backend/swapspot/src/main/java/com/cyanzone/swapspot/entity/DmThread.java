package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("dm_threads")
public class DmThread {
  @TableId(type = IdType.AUTO)
  private Long id;
  private Integer aId;
  private Integer bId;
  private Instant createdAt;
}