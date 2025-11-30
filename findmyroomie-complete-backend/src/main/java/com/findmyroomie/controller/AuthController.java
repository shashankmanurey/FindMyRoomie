package com.findmyroomie.controller;

import com.findmyroomie.model.User;
import com.findmyroomie.repository.UserRepository;
import com.findmyroomie.security.JwtUtil;
import com.findmyroomie.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, UserRepository userRepository, JwtUtil jwtUtil) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
        }
        User user = authService.register(email, password, name);
        String access = jwtUtil.generateToken(user.getEmail());
        String refresh = authService.createRefreshToken(user);
        return ResponseEntity.ok(Map.of("accessToken", access, "refreshToken", refresh, "user", Map.of("id", user.getId(), "email", user.getEmail(), "name", user.getName())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        authService.authenticate(email, password);
        User user = userRepository.findByEmail(email).orElseThrow();
        String access = jwtUtil.generateToken(user.getEmail());
        String refresh = authService.createRefreshToken(user);
        return ResponseEntity.ok(Map.of("accessToken", access, "refreshToken", refresh, "user", Map.of("id", user.getId(), "email", user.getEmail(), "name", user.getName())));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String token = body.get("refreshToken");
        if (token == null) return ResponseEntity.badRequest().build();
        return authService.findByToken(token).map(rt -> {
            if (rt.getExpiryDate().isBefore(Instant.now())) {
                return ResponseEntity.status(401).body(Map.of("error", "Refresh token expired"));
            }
            String access = jwtUtil.generateToken(rt.getUser().getEmail());
            return ResponseEntity.ok(Map.of("accessToken", access));
        }).orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email required"));
        }

        return userRepository.findByEmail(email).map(u -> {
            try {
                authService.deleteByUser(u);
                return ResponseEntity.ok(Map.of("status", "logged out"));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
            }
        }).orElse(ResponseEntity.badRequest().body(Map.of("error", "User not found")));
    }
}
