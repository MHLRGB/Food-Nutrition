package com.example.TestSecurity.service;


import com.example.TestSecurity.dto.JoinDTO;
import com.example.TestSecurity.entity.UserEntity;
import com.example.TestSecurity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JoinService {

    private final Logger log = LoggerFactory.getLogger(this.getClass().getSimpleName());

    @Autowired
    private UserRepository userRepository;  // 나중에 생성자 주입 방식 권고

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    public boolean checkDupId(String username) {
        boolean isDup = userRepository.existsByUsername(username);

        if(isDup) {
            log.info("checkDupId : isDup");
            return true;
        }
        log.info("checkDupId : isNotDup");
        return false;
    }

    public void joinProcess(JoinDTO joinDTO) {

        log.info("joinProcess");

        //db에 이미 동일한 username을 가진 회원이 존재하는지?
        if (checkDupId(joinDTO.getUsername())) {
            return;
        }

        // jpa 언어
        UserEntity data = new UserEntity();

        data.setUsername(joinDTO.getUsername());
        data.setPassword(bCryptPasswordEncoder.encode(joinDTO.getPassword())); // 해시 암호화(단방향)
        data.setRole("ROLE_ADMIN"); // 앞에 "ROLE_" 필수


        userRepository.save(data);

    }
}