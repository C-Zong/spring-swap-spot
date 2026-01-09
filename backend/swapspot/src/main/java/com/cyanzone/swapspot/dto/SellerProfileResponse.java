package com.cyanzone.swapspot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SellerProfileResponse {
    private Integer id;
    private String username;
    private String headline;
    private String bio;
    private String avatarUrl;
}
