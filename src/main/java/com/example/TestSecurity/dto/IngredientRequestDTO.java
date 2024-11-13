package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientRequestDTO {

    private String ingredientName;
    private Long ingredient_id;
    private Double quantity;
    private String unit;
    private String section;

}
