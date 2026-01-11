package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("dm_thread_user_state")
public class DmThreadUserState {
  @TableId(type = IdType.AUTO)
  private Long threadId;
  private Integer userId;
  private Long clearedBeforeMsgId;
  private Boolean isHidden;
  private Instant updatedAt;
}