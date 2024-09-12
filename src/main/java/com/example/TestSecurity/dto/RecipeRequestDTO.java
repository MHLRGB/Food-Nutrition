package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeRequestDTO {

    private String title;
    private String author;
    private String category;
    private String content;
    private List<IngredientRequestDTO> ingredients;
}
