package com.cyanzone.swapspot.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.time.LocalDateTime;

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

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
