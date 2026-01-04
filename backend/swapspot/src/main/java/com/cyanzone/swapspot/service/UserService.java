package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.dao.DuplicateKeyException;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.UserMapper;
import com.cyanzone.swapspot.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserMapper userMapper,
                       PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));

        try {
            userMapper.insert(user);
        } catch (DuplicateKeyException e) {
            throw new BusinessException(409, "Username already exists");
        }
        return user;
    }

    public User findByUsername(String username) {
        return userMapper.selectOne(
                new QueryWrapper<User>().eq("username", username)
        );
    }

    public User authenticate(String username, String rawPassword) {
        User user = findByUsername(username);
        if (user == null ||
                !passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new BusinessException(401, "Invalid username or password");
        }
        return user;
    }
}
