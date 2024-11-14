package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeRequestDTO {

    private String recipeTitle;
    private String recipeInfo;
    private Integer views;
    private String serving;
    private String cookingTime;
    private String difficulty;
    private String hashtag;
    private String byType;
    private String bySituation;
    private String byIngredient;
    private String byMethod;
    private List<IngredientRequestDTO> ingredients;
}

