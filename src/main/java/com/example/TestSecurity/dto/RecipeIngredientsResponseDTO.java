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

    private Long id;
    private String title;
    private String author;
    private String category;
    private int likes;
    private LocalDateTime createdDate;

    private List<IngredientsInfoResponseDTO> ingredients;
}
