package com.example.TestSecurity.dto;

import com.example.TestSecurity.entity.Ingredients;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientsInfoResponseDTO {

    private IngredientResponseDTO ingredientInfo; // IngredientDTO를 포함
    private Double quantity;
}
