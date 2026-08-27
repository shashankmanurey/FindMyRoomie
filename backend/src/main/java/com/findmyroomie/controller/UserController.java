package com.findmyroomie.controller;

import com.findmyroomie.model.User;
import com.findmyroomie.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> list() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>ofEntries(
                        Map.entry("id", u.getId()), Map.entry("name", u.getName()),
                        Map.entry("email", u.getEmail()), Map.entry("bio", u.getBio() == null ? "" : u.getBio()),
                        Map.entry("smoking", u.getSmoking() == null ? "" : u.getSmoking()),
                        Map.entry("drinking", u.getDrinking() == null ? "" : u.getDrinking()),
                        Map.entry("sleepSchedule", u.getSleepSchedule() == null ? "" : u.getSleepSchedule()),
                        Map.entry("occupation", u.getOccupation() == null ? "" : u.getOccupation()),
                        Map.entry("location", u.getLocation() == null ? "" : u.getLocation()),
                        Map.entry("budget", u.getBudget() == null ? 0 : u.getBudget())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, String> body) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("bio")) user.setBio(body.get("bio"));
        if (body.containsKey("avatarUrl")) user.setAvatarUrl(body.get("avatarUrl"));
        if (body.containsKey("smoking")) user.setSmoking(body.get("smoking"));
        if (body.containsKey("drinking")) user.setDrinking(body.get("drinking"));
        if (body.containsKey("sleepSchedule")) user.setSleepSchedule(body.get("sleepSchedule"));
        if (body.containsKey("occupation")) user.setOccupation(body.get("occupation"));
        if (body.containsKey("location")) user.setLocation(body.get("location"));
        if (body.containsKey("budget") && body.get("budget") != null && !body.get("budget").isBlank()) user.setBudget(Integer.valueOf(body.get("budget")));
        if (body.containsKey("moveInDate")) user.setMoveInDate(body.get("moveInDate"));
        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> { u.setPassword(null); return ResponseEntity.ok(u); })
                .orElse(ResponseEntity.notFound().build());
    }
}
