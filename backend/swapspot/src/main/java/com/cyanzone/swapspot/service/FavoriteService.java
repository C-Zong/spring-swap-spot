package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cyanzone.swapspot.entity.ItemFavorite;
import com.cyanzone.swapspot.mapper.ItemFavoriteMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    private final ItemFavoriteMapper mapper;

    public FavoriteService(ItemFavoriteMapper mapper) {
        this.mapper = mapper;
    }

    @Transactional
    public boolean toggle(int userId, long itemId) {
        QueryWrapper<ItemFavorite> qw = new QueryWrapper<ItemFavorite>()
                .eq("user_id", userId)
                .eq("item_id", itemId);

        boolean existed = mapper.selectCount(qw) > 0;

        if (existed) {
            mapper.delete(qw);
            return false;
        } else {
            ItemFavorite fav = new ItemFavorite();
            fav.setUserId(userId);
            fav.setItemId(itemId);
            mapper.insert(fav);
            return true;
        }
    }
}
