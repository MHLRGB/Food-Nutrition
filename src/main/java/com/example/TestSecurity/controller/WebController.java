package com.example.TestSecurity.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping(value =  {"/", "/login", "/join", "/test","/admin", "/common", "/community", "/community/*" ,"/community/recipe/*"})
    public String forward() {
        return "forward:/index.html";
    }
}

// 스프링 부트가 리액트의 뷰 페이지를 GetMapping으로 인식할 수 있게 설정.