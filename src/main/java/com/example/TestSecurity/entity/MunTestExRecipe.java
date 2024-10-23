package com.example.TestSecurity.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@Entity
@Table(name = "Mun_Test_ExRecipe")
public class MunTestExRecipe {

    @Id
    @Column(name = "레시피_번호", nullable = false)
    private Integer recipeNumber;

    @Column(name = "레시피_제목")
    private String recipeTitle;

    @Column(name = "조리_이름")
    private String cookingName;

    @Column(name = "등록자_ID")
    private String registrantID;

    @Column(name = "등록자_이름")
    private String registrantName;

    @Column(name = "조회_수")
    private Integer viewCount;

    @Column(name = "추천_수")
    private Integer recommendationCount;

    @Column(name = "스크랩_수")
    private Integer scrapCount;

    @Column(name = "조리_방법")
    private String cookingMethod;

    @Column(name = "조리_상태")
    private String cookingStatus;

    @Column(name = "조리_재료")
    private String cookingIngredients;

    @Column(name = "조리_종류")
    private String cookingType;

    @Column(name = "조리_소개")
    private String cookingIntroduction;

    @Column(name = "조리_재료_내용")
    private String cookingIngredientsContent;

    @Column(name = "조리_인분")
    private String servingSize;

    @Column(name = "조리_난이도")
    private String cookingDifficulty;

    @Column(name = "조리_시간")
    private String cookingTime;

}
