package com.example.TestSecurity.dto.recipe;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class IngredientSearchDTO {

    private Long ingredientId;
    private String ingredientName;
    private String ingredientGroup;
}
