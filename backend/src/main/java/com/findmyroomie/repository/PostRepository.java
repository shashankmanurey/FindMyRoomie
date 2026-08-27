package com.findmyroomie.repository;

import com.findmyroomie.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Post> findAllByAuthorLocationIgnoreCaseOrderByCreatedAtDesc(String location, Pageable pageable);
}
