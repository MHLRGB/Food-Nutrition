package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class CommunityRequestDTO {

    private String title;
    private String content;
    private String category;

    private RecipeRequestDTO recipeRequestDTO;
}
