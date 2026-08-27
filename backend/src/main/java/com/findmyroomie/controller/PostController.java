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
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

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
                      @RequestParam(defaultValue = "10") int size,
                      @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userDetails == null ? null : userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        Page<PostDto> posts = currentUser != null && currentUser.getLocation() != null && !currentUser.getLocation().isBlank()
            ? postService.listForCity(currentUser.getLocation(), PageRequest.of(page, size))
            : postService.list(PageRequest.of(page, size));
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/uploads/{fileName:.+}")
    public ResponseEntity<Resource> image(@PathVariable String fileName) throws IOException {
        Path uploadDirectory = Paths.get("uploads").toAbsolutePath().normalize();
        Path file = uploadDirectory.resolve(fileName).normalize();
        if (!file.startsWith(uploadDirectory)) {
            return ResponseEntity.badRequest().build();
        }
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists() || !resource.isReadable()) return ResponseEntity.notFound().build();
        String contentType = Files.probeContentType(file);
        MediaType mediaType = contentType == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(contentType);
        return ResponseEntity.ok().contentType(mediaType).body(resource);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> create(@AuthenticationPrincipal UserDetails userDetails,
                                    @RequestParam String content,
                                    @RequestParam("images") MultipartFile[] images) throws IOException {

        if (userDetails == null) return ResponseEntity.status(401).build();
        if (images.length < 3 || images.length > 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please upload between 3 and 6 room photos"));
        }
        for (MultipartFile image : images) {
            if (image.isEmpty() || image.getContentType() == null || !image.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only valid image files are allowed"));
            }
        }

        User author = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        PostDto created = postService.create(
                author,
                content,
                images
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
