package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.UserMapper;
import com.cyanzone.swapspot.entity.User;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserService {

    private final UserMapper userMapper;

    public CurrentUserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public Integer requireUserId() {
        String username = requireUsername();
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, username)
        );
        if (user == null) {
            throw new BusinessException(401, "Not logged in");
        }
        return user.getId();
    }

    public String requireUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()|| auth instanceof AnonymousAuthenticationToken) {
            throw new BusinessException(401, "Not logged in");
        }

        String username = auth.getName();
        if (username == null || username.isBlank()) {
            throw new BusinessException(401, "Not logged in");
        }
        return username;
    }
}
