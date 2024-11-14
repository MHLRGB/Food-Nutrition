// 데이터 바구니
package com.example.TestSecurity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true) // username 중복 방지
    private String username;

    private String password;

    @Column(columnDefinition = "int default 0") // SQL 레벨에서 기본값 설정
    private Integer setInterest = 0; // Java 레벨에서 초기값 설정

    private String role;
}