package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.Instant;

@Data
@TableName("dm_messages")
public class DmMessage {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long threadId;
    private Integer senderId;
    private String contentJson;

    private String clientMsgId;
    private Instant createdAt;
    private Instant revokedAt;
}