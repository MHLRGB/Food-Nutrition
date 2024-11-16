package com.example.TestSecurity.controller;

import com.example.TestSecurity.dto.JoinDTO;
import com.example.TestSecurity.dto.NowUserRequestDTO;
import com.example.TestSecurity.dto.NowUserResponseDTO;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.entity.UserEntity;
import com.example.TestSecurity.repository.UserRepository;
import com.example.TestSecurity.service.JoinService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.Optional;

@Controller
public class UserController {
    private final Logger log = LoggerFactory.getLogger(this.getClass().getSimpleName());

    @Autowired
    private JoinService joinService; // 현재 필드 주입으로 선언했지만, 생성자 주입 방식 권고
    @Autowired
    private UserRepository userRepository;

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

    @ResponseBody
    @GetMapping("/api/user/now")
    public NowUserResponseDTO NowUserInfo() {

        NowUserResponseDTO nowUserResponseDTO = new NowUserResponseDTO();

        // 접속중인 사용자의 username 반환
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 접속중인 사용자의 auth 반환
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        String role = auth.getAuthority();

        UserEntity userEntity = userRepository.findByUsername(username);



        nowUserResponseDTO.setUsername(username);
        nowUserResponseDTO.setRole(role);
        if (userEntity != null) {
            nowUserResponseDTO.setId(userEntity.getId() != 0 ? userEntity.getId() : 0);
            nowUserResponseDTO.setIsSetCat(userEntity.getIsSetCat() != null ? userEntity.getIsSetCat() : 0);
            nowUserResponseDTO.setCat1(userEntity.getCat1() != null ? userEntity.getCat1() : "0");
            nowUserResponseDTO.setCat2(userEntity.getCat2() != null ? userEntity.getCat2() : "0");
            nowUserResponseDTO.setCat3(userEntity.getCat3() != null ? userEntity.getCat3() : "0");
        }

        return nowUserResponseDTO;
    }
    @ResponseBody
    @PutMapping("/api/user/save/{id}")
    public ResponseEntity<String> saveUser(@RequestBody NowUserRequestDTO userDTO, @PathVariable Integer id) {
        // UserEntity 가져오기
        Optional<UserEntity> userOptional = userRepository.findById(id);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 접속중인 사용자의 auth 반환
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        String role = auth.getAuthority();

        if (!userOptional.isPresent()) {
            // 유저가 없으면 예외 처리 또는 에러 메시지 반환
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UserEntity userEntity = userOptional.get(); // Optional에서 값을 꺼냄

        // UserEntity 필드 업데이트
        userEntity.setUsername(username);
        userEntity.setRole(role);
        userEntity.setIsSetCat(1);  // isSetCat 값을 1로 설정
        userEntity.setCat1(userDTO.getCat1());
        userEntity.setCat2(userDTO.getCat2());
        userEntity.setCat3(userDTO.getCat3());

        // UserEntity 저장
        userRepository.save(userEntity);

        return new ResponseEntity<>("User saved successfully", HttpStatus.CREATED);
    }
}


// join.mustache에서 보내준 폼을 UserController가 Post방식으로 매핑하여 받아 DTO를 생성하여 JoinService로 넘겨주고,
// JoinService에서 해당 데이터의 username을 확인하고, 존재하지 않으면, DTO객체를 Entity 객체로 바꾼 후 회원정보를 테이블에 저장.
// "/join", "/joinProc" 경로를 모든 사용자가 접근할 수 있도록 SecurityConfig에서 설정.

// CustomeUserDetailsService는 DB로부터 특정 username에 대한 데이터를 들고 오고,
// 들고 온 데이터는 CustomUserDetails클래스에 넣어주고 SecurityConfig에 전달하면 검증한 후 페이지 접근 허용

// 사용자가 로그인을 한 뒤 사용자의 정보는 SecurityContextHolder에 의해 관리됨.