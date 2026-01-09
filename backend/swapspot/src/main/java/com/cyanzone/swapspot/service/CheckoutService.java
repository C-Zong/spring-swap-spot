package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cyanzone.swapspot.dto.CartCheckoutRow;
import com.cyanzone.swapspot.entity.CartItem;
import com.cyanzone.swapspot.entity.PurchaseRecord;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.CartMapper;
import com.cyanzone.swapspot.mapper.ItemMapper;
import com.cyanzone.swapspot.mapper.PurchaseRecordMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CheckoutService {

    private final CartMapper cartMapper;
    private final ItemMapper itemMapper;
    private final PurchaseRecordMapper purchaseRecordMapper;

    public CheckoutService(CartMapper cartMapper, ItemMapper itemMapper, PurchaseRecordMapper purchaseRecordMapper) {
        this.cartMapper = cartMapper;
        this.itemMapper = itemMapper;
        this.purchaseRecordMapper = purchaseRecordMapper;
    }

    @Transactional
    public void checkoutSeller(Integer buyerId, Integer sellerId) {
        List<CartCheckoutRow> rows = cartMapper.selectCheckoutRowsBySeller(buyerId, sellerId);
        if (rows.isEmpty()) {
            throw new BusinessException(400, "No items for this seller in cart");
        }

        for (CartCheckoutRow r : rows) {
            int need = (r.qty() == null ? 0 : r.qty());
            if (need <= 0) throw new BusinessException(400, "Invalid cart quantity");

            int ok = itemMapper.decrementStock(r.itemId(), need);
            if (ok != 1) {
                throw new BusinessException(409, "Insufficient stock for item " + r.itemId());
            }
        }

        for (CartCheckoutRow r : rows) {
            PurchaseRecord pr = new PurchaseRecord();
            pr.setBuyerId(buyerId);
            pr.setSellerId(sellerId);
            pr.setItemId(r.itemId());
            pr.setQuantity(r.qty());
            pr.setPriceCents(r.priceCents());
            pr.setCurrency(r.currency());
            purchaseRecordMapper.insert(pr);

            itemMapper.markSoldIfZero(r.itemId());
        }

        List<Long> itemIds = rows.stream().map(CartCheckoutRow::itemId).toList();
        cartMapper.delete(new LambdaQueryWrapper<CartItem>()
                .eq(CartItem::getUserId, buyerId)
                .in(CartItem::getItemId, itemIds));
    }
}
