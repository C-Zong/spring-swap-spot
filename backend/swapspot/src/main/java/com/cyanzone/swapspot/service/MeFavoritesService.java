package com.cyanzone.swapspot.service;

import com.cyanzone.swapspot.mapper.MeFavoritesMapper;
import com.cyanzone.swapspot.dto.FavoriteItemVM;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeFavoritesService {

    private final MeFavoritesMapper mapper;

    public MeFavoritesService(MeFavoritesMapper mapper) {
        this.mapper = mapper;
    }

    public List<FavoriteItemVM> list(int userId, Integer limit) {
        int n = (limit == null ? 5 : Math.max(1, Math.min(limit, 50)));
        return mapper.listFavorites(userId, n);
    }

    public void remove(int userId, long itemId) {
        mapper.deleteFavorite(userId, itemId);
    }
}
