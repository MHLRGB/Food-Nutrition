package com.example.TestSecurity.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private UserEntity userEntity;

    public CustomUserDetails(UserEntity userEntity) {
        this.userEntity = userEntity;
    }


    // 사용자의 특정 권한을 리턴(ex: Role)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {
                return userEntity.getRole();
            }


        });

        return collection;
    }
    public Integer getIsSetCat() {return userEntity.getIsSetCat();}

    @Override
    public String getPassword() {
        return userEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return userEntity.getUsername();
    }

    // 사용자 아이디 만료 여부 (true : 만료되지 않음) 설정하고싶으면 테이블에 해당 속성 추가
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 사용자 아이디 잠김 여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
