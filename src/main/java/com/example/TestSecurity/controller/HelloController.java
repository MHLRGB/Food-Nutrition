package com.example.TestSecurity.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello1")
    public String getHello() {
        return "Get Hello!";
    }

    @PostMapping("/hello2")
    public String postHello() {
        return "Post Hello!";
    }
}
