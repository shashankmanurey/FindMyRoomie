package com.findmyroomie.service;

import com.findmyroomie.dto.PostDto;
import com.findmyroomie.model.Post;
import com.findmyroomie.model.User;
import com.findmyroomie.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    public PostDto create(User author, String content, String imageUrl) {
        Post post = new Post();
        post.setAuthor(author);
        post.setContent(content);
        post.setImageUrl(imageUrl);

        Post saved = postRepository.save(post);
        return toDTO(saved);
    }

    public PostDto toDTO(Post post) {
        return new PostDto(
                post.getId(),
                post.getAuthor().getId(),
                post.getAuthor().getName(),
                post.getContent(),
                post.getImageUrl(),
                post.getCreatedAt()
        );
    }
}
