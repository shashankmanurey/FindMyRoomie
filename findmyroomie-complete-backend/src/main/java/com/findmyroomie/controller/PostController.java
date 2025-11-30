package com.findmyroomie.controller;

import com.findmyroomie.dto.PostDto;
import com.findmyroomie.model.Post;
import com.findmyroomie.model.User;
import com.findmyroomie.repository.PostRepository;
import com.findmyroomie.repository.UserRepository;
import com.findmyroomie.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public PostController(PostService postService, UserRepository userRepository, PostRepository postRepository) {
        this.postService = postService;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size) {

        Page<PostDto> posts = postService.list(PageRequest.of(page, size));
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal UserDetails userDetails,
                                    @RequestBody Map<String, String> body) {

        if (userDetails == null) return ResponseEntity.status(401).build();

        User author = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        PostDto created = postService.create(
                author,
                body.get("content"),
                body.get("imageUrl")
        );

        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> edit(@AuthenticationPrincipal UserDetails userDetails,
                                  @PathVariable Long id,
                                  @RequestBody Map<String, String> body) {

        if (userDetails == null) return ResponseEntity.status(401).build();

        Post post = postRepository.findById(id).orElseThrow();

        if (!post.getAuthor().getEmail().equals(userDetails.getUsername()))
            return ResponseEntity.status(403).build();

        if (body.containsKey("content")) post.setContent(body.get("content"));
        if (body.containsKey("imageUrl")) post.setImageUrl(body.get("imageUrl"));

        postRepository.save(post);

        return ResponseEntity.ok(postService.toDTO(post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable Long id) {

        if (userDetails == null) return ResponseEntity.status(401).build();

        Post post = postRepository.findById(id).orElseThrow();

        if (!post.getAuthor().getEmail().equals(userDetails.getUsername()))
            return ResponseEntity.status(403).build();

        postRepository.delete(post);
        return ResponseEntity.ok(Map.of("status", "deleted"));
    }
}
