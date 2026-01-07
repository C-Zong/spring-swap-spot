package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cyanzone.swapspot.dto.MyItemRow;
import com.cyanzone.swapspot.entity.Item;
import com.cyanzone.swapspot.mapper.ItemMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemListService {

    private final ItemMapper itemMapper;
    private final CurrentUserService currentUserService;

    public ItemListService(ItemMapper itemMapper, CurrentUserService currentUserService) {
        this.itemMapper = itemMapper;
        this.currentUserService = currentUserService;
    }

    public List<MyItemRow> listMyItems() {
        Integer userId = currentUserService.requireUserId();

        List<Item> items = itemMapper.selectList(
                new LambdaQueryWrapper<Item>()
                        .eq(Item::getSellerId, userId)
                        .orderByDesc(Item::getUpdatedAt)
        );

        return items.stream()
                .map(it -> new MyItemRow(
                        it.getId(),
                        it.getTitle(),
                        it.getPriceCents(),
                        it.getCurrency(),
                        it.getStatus(),
                        it.getUpdatedAt()
                ))
                .toList();
    }
}
