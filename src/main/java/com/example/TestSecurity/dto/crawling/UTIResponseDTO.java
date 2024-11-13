package com.example.TestSecurity.dto.crawling;

import com.example.TestSecurity.dto.IngredientsInfoResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class UTIResponseDTO {

    private Long id;  // 아이디
    private Integer recipeNumber;  // recipe_number
    private String recipeTitle;  // recipe_title
    private String recipeInfo;  // recipe_info
    private Integer views;  // 조회수
    private String chef;  // 셰프
    private String servings;  // 인분
    private String cookingTime;  // 조리시간
    private String difficulty;  // 난이도
    private String hashtags;  // 해시태그
    private String category;  // 종류별
    private String situation;  // 상황별
    private String ingredientType;  // 재료별
    private String method;  // 방법별

    private List<UTIIngredientsInfoResponseDTO> ingredientsInfo;
}
