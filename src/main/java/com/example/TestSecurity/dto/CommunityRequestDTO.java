package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CommunityRequestDTO {

    private String title;
    private String content;
    private String category;

    private RecipeRequestDTO recipeRequestDTO;
}
