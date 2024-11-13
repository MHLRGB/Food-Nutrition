package com.example.TestSecurity.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientResponseDTO {
    private Long ingredientsID;
    private String ingredientName;
    private Float cal;
    private Float carbohydrates;
    private Float sugars;
    private Float protein;
    private Float fat;
    private Float sodium;
}
