package com.example.TestSecurity.dto;

import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class RecipeIngredientsResponseDTO {

    private Long recipeId;
    private String recipeTitle;
    private String recipeInfo;
    private Integer views;
    private String chef;
    private String serving;
    private String cookingTime;
    private String difficulty;
    private String hashtag;
    private String byType;
    private String bySituation;
    private String byIngredient;
    private String byMethod;

    private List<IngredientsInfoResponseDTO> ingredientsInfo;
}
