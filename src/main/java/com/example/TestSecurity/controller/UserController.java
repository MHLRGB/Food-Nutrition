package com.example.TestSecurity.controller;

import com.example.TestSecurity.dto.JoinDTO;
import com.example.TestSecurity.service.JoinService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
public class UserController {
    private final Logger log = LoggerFactory.getLogger(this.getClass().getSimpleName());

    @Autowired
    private JoinService joinService; // 현재 필드 주입으로 선언했지만, 생성자 주입 방식 권고

    @GetMapping("/joinProc")
    public String joinProcess(JoinDTO joinDTO) {
        log.info("username : " + joinDTO.getUsername());

        joinService.joinProcess(joinDTO);

        return "redirect:/login";
    }

    @ResponseBody
    @PostMapping("/api/checkid")
    public boolean CheckDupId(@RequestBody String usernameJson) {

        ObjectMapper objectMapper = new ObjectMapper();
        String username = "";
        try {
            JsonNode jsonNode = objectMapper.readTree(usernameJson);
            username = jsonNode.get("username").asText();
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("Received username: " + username);

        return joinService.checkDupId(username);
    }
}

// join.mustache에서 보내준 폼을 UserController가 Post방식으로 매핑하여 받아 DTO를 생성하여 JoinService로 넘겨주고,
// JoinService에서 해당 데이터의 username을 확인하고, 존재하지 않으면, DTO객체를 Entity 객체로 바꾼 후 회원정보를 테이블에 저장.
// "/join", "/joinProc" 경로를 모든 사용자가 접근할 수 있도록 SecurityConfig에서 설정.

// CustomeUserDetailsService는 DB로부터 특정 username에 대한 데이터를 들고 오고,
// 들고 온 데이터는 CustomUserDetails클래스에 넣어주고 SecurityConfig에 전달하면 검증한 후 페이지 접근 허용

// 사용자가 로그인을 한 뒤 사용자의 정보는 SecurityContextHolder에 의해 관리됨.