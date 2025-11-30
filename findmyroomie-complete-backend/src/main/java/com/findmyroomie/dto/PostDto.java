package com.findmyroomie.dto;


import java.time.LocalDateTime;

public record PostDto(
        Long id,
        Long authorId,
        String authorName,
        String content,
        String imageUrl,
        LocalDateTime createdAt
) {}

