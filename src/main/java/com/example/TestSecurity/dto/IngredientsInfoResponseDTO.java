package com.example.TestSecurity.dto;

import com.example.TestSecurity.entity.Ingredients;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientsInfoResponseDTO {

    private Long ingredientId;
    private Double quantity;
    private String unit;
    private String section;
}
