package com.example.TestSecurity.controller;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Iterator;

@RestController
public class MainController {

    @GetMapping("/api/login")
    public String mainP(Model model) {

        // 접속중인 사용자의 id 반환
        String id = SecurityContextHolder.getContext().getAuthentication().getName();


        // 접속중인 사용자의 auth 반환
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        String role = auth.getAuthority();



        model.addAttribute("id", id);
        model.addAttribute("role", role);

        return id;
    }
}