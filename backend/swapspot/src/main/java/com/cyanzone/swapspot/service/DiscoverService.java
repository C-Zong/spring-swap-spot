package com.cyanzone.swapspot.service;

import com.cyanzone.swapspot.dto.DiscoverRow;
import com.cyanzone.swapspot.dto.ListingDto;
import com.cyanzone.swapspot.mapper.DiscoverMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiscoverService {

    private final CurrentUserService currentUserService;
    private final DiscoverMapper discoverMapper;
    private final S3Service s3Service;

    public DiscoverService(CurrentUserService currentUserService,
                           DiscoverMapper discoverMapper,
                           S3Service s3Service) {
        this.currentUserService = currentUserService;
        this.discoverMapper = discoverMapper;
        this.s3Service = s3Service;
    }

    public List<ListingDto> discover(int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 60);
        Integer userId = currentUserService.getUserIdOrNull();

        return discoverMapper.selectDiscoverRows(safeLimit, userId).stream()
                .map(r -> toDto(r, userId))
                .toList();
    }

    public List<ListingDto> search(String q, int limit) {
        Integer userId = currentUserService.getUserIdOrNull();
        return discoverMapper.selectSearchRows(limit, userId, q)
                .stream()
                .map(r -> toDto(r, userId))
                .toList();
    }

    private ListingDto toDto(DiscoverRow r, Integer userId) {
        return new ListingDto(
                r.id(),
                r.title(),
                r.priceCents(),
                r.currency(),
                r.status(),
                r.updatedAt(),
                r.coverKey() == null ? null : s3Service.presignGetUrl(r.coverKey()),
                userId == null ? null : (r.favored() != null && r.favored() == 1)
        );
    }

}

