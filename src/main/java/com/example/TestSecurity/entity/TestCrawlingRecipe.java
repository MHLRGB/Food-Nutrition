package com.example.TestSecurity.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

// 크롤링 데이터 다루는 테스트 테이블

@Entity
@Table(name = "Test_Crawling_Recipe")
@Getter
@Setter
public class TestCrawlingRecipe {

    @Id
    @Column(name = "아이디", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "recipe_number", nullable = false)
    private Integer recipeNumber;

    @Column(name = "레시피_제목", length = 255)
    private String recipeTitle;

    @Column(name = "레시피_소개", columnDefinition = "TEXT")
    private String recipeIntro;

    @Column(name = "조회수")
    private Integer views;

    @Column(name = "셰프", length = 100)
    private String chef;

    @Column(name = "인분", length = 50)
    private String servings;

    @Column(name = "조리시간", length = 50)
    private String cookingTime;

    @Column(name = "난이도", length = 50)
    private String difficulty;

    @Column(name = "ingredient_content", columnDefinition = "TEXT")
    private String ingredientsContent;

    @Column(name = "인트로", columnDefinition = "TEXT")
    private String intro;

    @Column(name = "해시태그", columnDefinition = "TEXT")
    private String hashtags;

    @Column(name = "종류별", length = 50)
    private String category;

    @Column(name = "상황별", length = 50)
    private String situation;

    @Column(name = "재료별", length = 50)
    private String ingredientType;

    @Column(name = "방법별", length = 50)
    private String method;
}
