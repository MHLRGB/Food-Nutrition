package com.example.TestSecurity.service;

import com.example.TestSecurity.entity.CustomUserDetails;
import com.example.TestSecurity.entity.UserEntity;
import com.example.TestSecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository; // 생성자 주입 방식 권고, final 키워드 등 권고


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("UserDetails");
        UserEntity userData = userRepository.findByUsername(username);

        if (userData != null) {

            return new CustomUserDetails(userData);
        }

        return null;
    }
}

