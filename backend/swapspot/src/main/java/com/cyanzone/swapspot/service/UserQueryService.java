package com.cyanzone.swapspot.service;

import com.cyanzone.swapspot.dto.SellerProfileResponse;
import com.cyanzone.swapspot.entity.User;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserQueryService {

    private final UserMapper userMapper;
    private final S3Service s3Service;

    public UserQueryService(UserMapper userMapper, S3Service s3Service) {
        this.userMapper = userMapper;
        this.s3Service = s3Service;
    }

    public SellerProfileResponse getSellerProfile(Integer id) {
        User u = userMapper.selectById(id);
        if (u == null) throw new BusinessException(404, "User not found");

        String avatarUrl = s3Service.presignGetUrl(u.getAvatarKey());
        return new SellerProfileResponse(u.getId(), u.getUsername(), u.getHeadline(), u.getBio(), avatarUrl);
    }
}
