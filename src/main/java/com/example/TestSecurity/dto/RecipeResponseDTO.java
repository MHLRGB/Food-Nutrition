package com.example.TestSecurity.dto;

import com.example.TestSecurity.entity.Recipe;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeResponseDTO {

    private Long recipe_id;
    private String recipe_title;
    private String recipe_info;
    private Integer views;
    private String chef;
    private String serving;
    private String cooking_time;
    private String difficulty;
    private String hashtag;
    private String by_type;
    private String by_situation;
    private String by_ingredient;
    private String by_method;

    // Recipe -> RecipeResponseDTO 변환하는 메서드
    public static RecipeResponseDTO from(Recipe recipe) {
        RecipeResponseDTO dto = new RecipeResponseDTO();
        dto.setRecipe_id(recipe.getRecipe_id());
        dto.setRecipe_title(recipe.getRecipe_title());
        dto.setRecipe_info(recipe.getRecipe_info());
        dto.setViews(recipe.getViews());
        dto.setChef(recipe.getChef());
        dto.setServing(recipe.getServing());
        dto.setCooking_time(recipe.getCooking_time());
        dto.setDifficulty(recipe.getDifficulty());
        dto.setHashtag(recipe.getHashtag());
        dto.setBy_type(recipe.getBy_type());
        dto.setBy_situation(recipe.getBy_situation());
        dto.setBy_ingredient(recipe.getBy_ingredient());
        dto.setBy_method(recipe.getBy_method());

        return dto;
    }
}
