package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.cyanzone.swapspot.dto.CartLineVM;
import com.cyanzone.swapspot.dto.CartRow;
import com.cyanzone.swapspot.dto.CartSellerVM;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.entity.CartItem;
import com.cyanzone.swapspot.mapper.CartMapper;
import com.cyanzone.swapspot.mapper.ItemMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartMapper cartMapper;
    private final ItemMapper itemMapper;
    private final S3Service s3Service;

    public CartService(CartMapper cartMapper,
                       ItemMapper itemMapper,
                       S3Service s3Service) {
        this.cartMapper = cartMapper;
        this.itemMapper = itemMapper;
        this.s3Service = s3Service;
    }

    @Transactional
    public void add(int userId, long itemId, int delta) {
        if (delta <= 0) delta = 1;

        var item = itemMapper.selectById(itemId);
        if (item == null || !"Active".equals(item.getStatus())) {
            throw new BusinessException(400, "Item not available");
        }

        cartMapper.add(userId, itemId, delta);
    }

    @Transactional
    public List<CartSellerVM> getCartGroupedNormalized(Integer userId) {
        List<CartRow> rows = cartMapper.selectCartRows(userId);

        for (CartRow r : rows) {
            int stock = r.stockQty() == null ? 0 : r.stockQty();
            int qty = r.cartQty() == null ? 0 : r.cartQty();

            if (stock <= 0 || qty <= 0) {
                cartMapper.delete(new LambdaQueryWrapper<CartItem>()
                        .eq(CartItem::getUserId, userId)
                        .eq(CartItem::getItemId, r.itemId()));
            } else if (qty > stock) {
                cartMapper.update(null, new LambdaUpdateWrapper<CartItem>()
                        .eq(CartItem::getUserId, userId)
                        .eq(CartItem::getItemId, r.itemId())
                        .set(CartItem::getQuantity, stock));
            }
        }

        List<CartRow> normalized = cartMapper.selectCartRows(userId);

        Map<Integer, List<CartRow>> bySeller = normalized.stream()
                .collect(Collectors.groupingBy(CartRow::sellerId, LinkedHashMap::new, Collectors.toList()));

        List<CartSellerVM> out = new ArrayList<>();
        for (var e : bySeller.entrySet()) {
            List<CartRow> list = e.getValue();
            CartRow first = list.getFirst();

            String sellerAvatarUrl = s3Service.presignGetUrl(first.sellerAvatarKey());

            List<CartLineVM> lines = list.stream().map(x -> new CartLineVM(
                    x.itemId(),
                    x.title(),
                    x.priceCents(),
                    x.currency(),
                    x.cartQty(),
                    x.stockQty() == null ? 0 : x.stockQty(),
                    s3Service.presignGetUrl(x.coverKey())
            )).toList();

            out.add(new CartSellerVM(
                    first.sellerId(),
                    first.sellerUsername(),
                    sellerAvatarUrl,
                    lines
            ));
        }
        return out;
    }

    @Transactional
    public void remove(Integer userId, Long itemId) {
        cartMapper.delete(new LambdaQueryWrapper<CartItem>()
                .eq(CartItem::getUserId, userId)
                .eq(CartItem::getItemId, itemId));
    }
}
