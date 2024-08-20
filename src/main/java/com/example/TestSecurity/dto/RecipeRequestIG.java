package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeRequestIG {

    private String title;
    private String author;
    private String content;
    private String category;
    private List<IngredientDTO> ingredients;

}
