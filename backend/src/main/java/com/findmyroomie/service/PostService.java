package com.findmyroomie.service;

import com.findmyroomie.dto.PostDto;
import com.findmyroomie.model.Post;
import com.findmyroomie.model.User;
import com.findmyroomie.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Page<PostDto> list(Pageable pageable) {
        return postRepository
                .findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toDTO);
    }

    public Page<PostDto> listForCity(String location, Pageable pageable) {
        return postRepository.findAllByAuthorLocationIgnoreCaseOrderByCreatedAtDesc(location, pageable).map(this::toDTO);
    }

    public PostDto create(User author, String content, MultipartFile[] images) throws IOException {
        Post post = new Post();
        post.setAuthor(author);
        post.setContent(content);
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            String originalName = image.getOriginalFilename() == null ? "room-photo" : image.getOriginalFilename();
            String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : ".jpg";
            String fileName = UUID.randomUUID() + extension.toLowerCase();
            Path uploadDirectory = Paths.get("uploads");
            Files.createDirectories(uploadDirectory);
            Files.copy(image.getInputStream(), uploadDirectory.resolve(fileName));
            imageUrls.add("/api/posts/uploads/" + fileName);
        }
        post.setImageUrls(imageUrls);

        Post saved = postRepository.save(post);
        return toDTO(saved);
    }

    public PostDto toDTO(Post post) {
        return new PostDto(
                post.getId(),
                post.getAuthor().getId(),
                post.getAuthor().getEmail(),
                post.getAuthor().getName(),
                post.getContent(),
                post.getImageUrls(),
                post.getCreatedAt(),
                post.getAuthor().getBio(), post.getAuthor().getSmoking(), post.getAuthor().getDrinking(),
                post.getAuthor().getSleepSchedule(), post.getAuthor().getOccupation(), post.getAuthor().getLocation(),
                post.getAuthor().getBudget(), post.getAuthor().getMoveInDate()
        );
    }
}
