package com.findmyroomie.dto;


import java.time.LocalDateTime;
import java.util.List;

public record PostDto(
        Long id,
        Long authorId,
        String authorEmail,
        String authorName,
        String content,
        List<String> imageUrls,
        LocalDateTime createdAt,
        String bio,
        String smoking,
        String drinking,
        String sleepSchedule,
        String occupation,
        String location,
        Integer budget,
        String moveInDate
) {}

