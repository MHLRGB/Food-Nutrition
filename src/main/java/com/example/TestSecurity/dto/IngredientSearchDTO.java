package com.example.TestSecurity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class IngredientSearchDTO {

    private Long ingredientId;
    private String ingredientName;
}
