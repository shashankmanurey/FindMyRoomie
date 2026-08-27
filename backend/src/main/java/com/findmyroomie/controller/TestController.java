package com.findmyroomie.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/auth/test")
    public String test() {
        return "Backend is running successfully ✅";
    }
}
