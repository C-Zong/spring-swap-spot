package com.cyanzone.swapspot.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;

import java.time.Instant;

@Data
public class DmThreadRow {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long threadId;
    private Integer otherUserId;
    private String otherUsername;
    private String otherAvatarUrl;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long latestMsgId;
    private String latestContentJson;
    private Instant latestAt;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long clearedBeforeMsgId;

    // Derived field, not persisted
    private Boolean unreadDot;
}
