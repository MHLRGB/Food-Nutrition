package com.example.TestSecurity.dto;

import com.example.TestSecurity.entity.Recipe;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeResponseDTO {

    private Long recipeId;
    private String recipeTitle;
    private String recipeInfo;
    private Integer views;
    private String chef;
    private String serving;
    private String cookingTime;
    private String difficulty;
    private String hashtag;
    private String byType;
    private String bySituation;
    private String byIngredient;
    private String byMethod;

    // Recipe -> RecipeResponseDTO 변환하는 메서드
    public static RecipeResponseDTO from(Recipe recipe) {
        RecipeResponseDTO dto = new RecipeResponseDTO();
        dto.setRecipeId(recipe.getRecipeId());
        dto.setRecipeTitle(recipe.getRecipeTitle());
        dto.setRecipeInfo(recipe.getRecipeInfo());
        dto.setViews(recipe.getViews());
        dto.setChef(recipe.getChef());
        dto.setServing(recipe.getServing());
        dto.setCookingTime(recipe.getCookingTime());
        dto.setDifficulty(recipe.getDifficulty());
        dto.setHashtag(recipe.getHashtag());
        dto.setByType(recipe.getByType());
        dto.setBySituation(recipe.getBySituation());
        dto.setByIngredient(recipe.getByIngredient());
        dto.setByMethod(recipe.getByMethod());

        return dto;
    }
}
