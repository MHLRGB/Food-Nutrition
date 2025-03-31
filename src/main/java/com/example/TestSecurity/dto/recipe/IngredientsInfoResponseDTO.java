package com.example.TestSecurity.dto.recipe;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientsInfoResponseDTO {

    private String ingredientName;
    private Long ingredientId;
    private Double quantity;
    private String unit;
    private String section;
}
