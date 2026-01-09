package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cyanzone.swapspot.dto.ItemDetailResponse;
import com.cyanzone.swapspot.dto.SellerDto;
import com.cyanzone.swapspot.entity.Item;
import com.cyanzone.swapspot.entity.ItemImage;
import com.cyanzone.swapspot.entity.User;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.ItemImageMapper;
import com.cyanzone.swapspot.mapper.ItemMapper;
import com.cyanzone.swapspot.mapper.UserMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ItemQueryService {

    private final ItemMapper itemMapper;
    private final ItemImageMapper itemImageMapper;
    private final CurrentUserService currentUserService;
    private final UserMapper userMapper;
    private final S3Service s3Service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ItemQueryService(ItemMapper itemMapper
            , ItemImageMapper itemImageMapper
            , CurrentUserService currentUserService
            , UserMapper userMapper
            , S3Service s3Service) {
        this.itemMapper = itemMapper;
        this.itemImageMapper = itemImageMapper;
        this.currentUserService = currentUserService;
        this.userMapper = userMapper;
        this.s3Service = s3Service;
    }

    public ItemDetailResponse getById(Long id) {
        if (id == null) throw new BusinessException(400, "id required");

        Item item = itemMapper.selectById(id);
        if (item == null) throw new BusinessException(404, "Item not found");

        Integer viewerId = currentUserService.getUserIdOrNull();
        boolean viewerIsSeller =
                viewerId != null && viewerId.equals(item.getSellerId());
        if ("Draft".equalsIgnoreCase(item.getStatus())) {
            if (viewerId == null || !viewerIsSeller) {
                throw new BusinessException(404, "Item not found");
            }
        }

        List<ItemImage> imgs = itemImageMapper.selectList(
                new LambdaQueryWrapper<ItemImage>()
                        .eq(ItemImage::getItemId, item.getId())
                        .orderByAsc(ItemImage::getSortOrder)
        );

        List<ItemDetailResponse.ItemImageDto> images = imgs.stream()
                .map(i -> new ItemDetailResponse.ItemImageDto(i.getS3Key(), i.getSortOrder()))
                .toList();

        List<String> tags = parseTags(item.getTagsJson());

        User seller = userMapper.selectById(item.getSellerId());
        SellerDto sellerDto = new SellerDto(
                seller.getId(),
                seller.getUsername(),
                s3Service.presignGetUrl(seller.getAvatarKey())
        );

        return new ItemDetailResponse(
                item.getId(),
                item.getSellerId(),
                item.getTitle(),
                item.getDescription(),
                item.getPriceCents(),
                item.getCurrency(),

                item.getCategory(),
                item.getItemCondition(),
                item.getTradeMethod(),
                item.getLocation(),

                tags,
                item.getQuantity(),
                item.getNegotiable(),
                item.getStatus(),

                images,

                item.getCreatedAt(),
                item.getUpdatedAt(),

                sellerDto,
                viewerIsSeller
        );
    }

    private List<String> parseTags(String tagsJson) {
        if (tagsJson == null || tagsJson.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(tagsJson, new TypeReference<>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
