package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeRequestDTO {

    private String recipe_title;
    private String recipe_info;
    private Integer views;
    private String chef;
    private String serving;
    private String cooking_time;
    private String difficulty;
    private String hashtag;
    private String by_type;
    private String by_situation;
    private String by_ingredient;
    private String by_method;
    private List<IngredientRequestDTO> ingredients;
}

