package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.cyanzone.swapspot.dto.PatchItemRequest;
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
public class ItemWriteService {

    private final ItemMapper itemMapper;
    private final ItemImageMapper itemImageMapper;
    private final CurrentUserService currentUserService;
    private final ObjectMapper objectMapper;

    public ItemWriteService(
            ItemMapper itemMapper,
            ItemImageMapper itemImageMapper,
            CurrentUserService currentUserService,
            ObjectMapper objectMapper
    ) {
        this.itemMapper = itemMapper;
        this.itemImageMapper = itemImageMapper;
        this.currentUserService = currentUserService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void updateItem(Long id, PatchItemRequest req) {
        if (id == null) throw new BusinessException(400, "id required");
        if (req == null) throw new BusinessException(400, "body required");

        Integer userId = currentUserService.requireUserId();

        Item item = itemMapper.selectById(id);
        if (item == null) throw new BusinessException(404, "Item not found");
        if (!userId.equals(item.getSellerId())) throw new BusinessException(403, "Forbidden");

        if (req.title() == null || req.title().isBlank()) throw new BusinessException(400, "title required");
        if (req.priceCents() == null || req.priceCents() < 0) throw new BusinessException(400, "priceCents invalid");
        if (req.description() == null || req.description().isBlank())
            throw new BusinessException(400, "description required");
        if (req.location() == null || req.location().isBlank()) throw new BusinessException(400, "location required");

        List<String> imageKeys = req.imageKeys() == null ? List.of() : req.imageKeys();
        if (imageKeys.isEmpty()) throw new BusinessException(400, "at least 1 image required");
        if (imageKeys.size() > 5) throw new BusinessException(400, "max 5 images");

        item.setQuantity(req.quantity() == null ? 1 : req.quantity());
        item.setNegotiable(req.negotiable() != null ? req.negotiable() : Boolean.TRUE);
        item.setStatus(req.status() == null ? "Draft" : req.status());

        try {
            String tagsJson = objectMapper.writeValueAsString(req.tags() == null ? List.of() : req.tags());
            item.setTagsJson(tagsJson);
        } catch (Exception e) {
            throw new BusinessException(400, "invalid tags");
        }

        itemMapper.update(
            null,
            new LambdaUpdateWrapper<Item>()
                .eq(Item::getId, id)
                .eq(Item::getSellerId, userId)

                .set(Item::getTitle, req.title().trim())
                .set(Item::getPriceCents, req.priceCents())
                .set(Item::getDescription, req.description().trim())

                .set(Item::getCategory, req.category())
                .set(Item::getItemCondition, req.condition())
                .set(Item::getTradeMethod, req.tradeMethod())
                .set(Item::getLocation, req.location().trim())

                .set(Item::getQuantity, req.quantity())
                .set(Item::getNegotiable, req.negotiable())
                .set(Item::getStatus, req.status())
        );

        itemImageMapper.delete(new LambdaQueryWrapper<ItemImage>().eq(ItemImage::getItemId, id));

        for (int i = 0; i < imageKeys.size(); i++) {
            String key = imageKeys.get(i);
            if (key == null || key.isBlank()) throw new BusinessException(400, "invalid imageKeys");

            if (!key.startsWith("tmp/items/") && !key.startsWith("items/")) {
                throw new BusinessException(400, "invalid image key");
            }

            ItemImage img = new ItemImage();
            img.setItemId(id);
            img.setS3Key(key);
            img.setSortOrder(i);
            itemImageMapper.insert(img);
        }
    }

    @Transactional
    public void deleteMyItem(Long id) {
        if (id == null) throw new BusinessException(400, "id required");

        Integer userId = currentUserService.requireUserId();

        Item item = itemMapper.selectById(id);
        if (item == null) throw new BusinessException(404, "Item not found");
        if (!userId.equals(item.getSellerId())) throw new BusinessException(403, "Forbidden");

        itemMapper.deleteById(id);
    }
}
