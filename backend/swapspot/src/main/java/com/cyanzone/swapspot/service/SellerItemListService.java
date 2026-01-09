package com.cyanzone.swapspot.service;

import com.cyanzone.swapspot.dto.SellerItemCard;
import com.cyanzone.swapspot.dto.SellerItemCardRow;
import com.cyanzone.swapspot.mapper.SellerItemMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SellerItemListService {

    private final SellerItemMapper sellerItemMapper;
    private final S3Service s3Service;

    public SellerItemListService(SellerItemMapper sellerItemMapper, S3Service s3Service) {
        this.sellerItemMapper = sellerItemMapper;
        this.s3Service = s3Service;
    }

    public List<SellerItemCard> listSellerItems(Integer sellerId, String status, Integer limit) {
        int lim = (limit == null || limit <= 0) ? 12 : Math.min(limit, 60);
        String st = (status == null || status.isBlank()) ? "Active" : status;

        List<SellerItemCardRow> rows = sellerItemMapper.listSellerActiveItems(sellerId, st, lim);
        return rows.stream().map(r -> new SellerItemCard(
                r.getId(),
                r.getTitle(),
                r.getPriceCents(),
                r.getCurrency(),
                r.getLocation(),
                r.getNegotiable(),
                r.getQuantity(),
                r.getCoverKey() == null ? null : s3Service.presignGetUrl(r.getCoverKey()),
                r.getUpdatedAt() == null ? null : r.getUpdatedAt()
        )).toList();
    }
}
