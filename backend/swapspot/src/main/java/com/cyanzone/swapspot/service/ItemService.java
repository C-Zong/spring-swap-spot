package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.cyanzone.swapspot.dto.CreateItemRequest;
import com.cyanzone.swapspot.entity.Item;
import com.cyanzone.swapspot.entity.ItemImage;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.ItemImageMapper;
import com.cyanzone.swapspot.mapper.ItemMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {

    private final ItemMapper itemMapper;
    private final ItemImageMapper itemImageMapper;
    private final CurrentUserService currentUserService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ItemService(ItemMapper itemMapper,
                       ItemImageMapper itemImageMapper,
                       CurrentUserService currentUserService) {
        this.itemMapper = itemMapper;
        this.itemImageMapper = itemImageMapper;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public Long create(CreateItemRequest req) {
        Integer sellerId = currentUserService.requireUserId();

        if (req == null) throw new BusinessException(400, "request required");
        if (!StringUtils.isNotBlank(req.title())) throw new BusinessException(400, "title required");
        if (req.priceCents() == null || req.priceCents() < 0) throw new BusinessException(400, "invalid price");
        if (!StringUtils.isNotBlank(req.description())) throw new BusinessException(400, "description required");
        if (!StringUtils.isNotBlank(req.location())) throw new BusinessException(400, "location required");
        if (req.quantity() != null && req.quantity() < 1) throw new BusinessException(400, "quantity must be >= 1");

        List<String> imageKeys = req.imageKeys();
        if (imageKeys == null || imageKeys.isEmpty()) throw new BusinessException(400, "at least 1 image required");
        if (imageKeys.size() > 5) throw new BusinessException(400, "max 5 images");

        for (String key : imageKeys) {
            if (!StringUtils.isNotBlank(key)) throw new BusinessException(400, "invalid image key");
            if (!key.startsWith("tmp/items/") && !key.startsWith("items/")) {
                throw new BusinessException(400, "invalid image key");
            }
        }

        String tagsJson = null;
        try {
            if (req.tags() != null) tagsJson = objectMapper.writeValueAsString(req.tags());
        } catch (Exception e) {
            throw new BusinessException(400, "invalid tags");
        }

        Item item = buildItem(req, sellerId, tagsJson);
        itemMapper.insert(item);
        for (int i = 0; i < imageKeys.size(); i++) {
            ItemImage img = new ItemImage();
            img.setItemId(item.getId());
            img.setS3Key(imageKeys.get(i));
            img.setSortOrder(i);
            itemImageMapper.insert(img);
        }

        return item.getId();
    }

    private Item buildItem(CreateItemRequest req, Integer sellerId, String tagsJson) {
        Item item = new Item();
        item.setSellerId(sellerId);
        item.setTitle(req.title().trim());
        item.setDescription(req.description().trim());
        item.setPriceCents(req.priceCents());
        item.setCurrency("USD");
        item.setCategory(req.category());
        item.setItemCondition(req.condition());
        item.setTradeMethod(req.tradeMethod());
        item.setLocation(req.location());
        item.setTagsJson(tagsJson);
        item.setQuantity(req.quantity() == null ? 1 : req.quantity());
        item.setNegotiable(req.negotiable() == null || req.negotiable());
        item.setStatus(req.status() == null ? "Draft" : req.status());
        return item;
    }
}
