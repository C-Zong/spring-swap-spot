package com.cyanzone.swapspot.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;

import java.time.Instant;

@Data
public class DmMessageRow {
  @JsonSerialize(using = ToStringSerializer.class)
  private Long id;
  private Integer senderId;
  private String contentJson;
  private Instant createdAt;
  private Instant revokedAt;

  // Derived field, not persisted
  private Boolean isMe;
}