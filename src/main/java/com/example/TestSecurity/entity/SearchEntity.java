package com.example.TestSecurity.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;  // Table 어노테이션 임포트
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "PreprocessedRecipes") // 테이블 이름 지정
@Getter
@Setter
public class SearchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_number") // 컬럼명과 일치하도록 지정
    private Long recipeNumber;

    @Column(name = "recipe_title") // 컬럼명과 일치하도록 지정
    private String title;

    // 기본 생성자
    public SearchEntity() {}

    // 생성자
    public SearchEntity(Long recipeNumber, String title) {
        this.recipeNumber = recipeNumber;
        this.title = title;
    }
}
