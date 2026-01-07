package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@TableName("users")
public class User {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String username;
    private String passwordHash;

    private String headline;
    private String bio;
    private String avatarKey;

    private Instant createdAt;
    private Instant updatedAt;
}
