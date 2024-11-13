package com.example.TestSecurity.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Test_Crawling_Recipe")
@Getter
@Setter
public class TestCrawlingRecipe {

    @Id
    @Column(name = "id", nullable = false)  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipe_number", nullable = false)  // recipe_number
    private Integer recipeNumber;

    @Column(name = "recipe_title", length = 255)  // recipe_title
    private String recipeTitle;

    @Column(name = "recipe_info", columnDefinition = "TEXT")  // recipe_info
    private String recipeInfo;

    @Column(name = "views")  // views
    private Integer views;

    @Column(name = "chef", length = 100)  // chef
    private String chef;

    @Column(name = "serving", length = 50)  // serving
    private String servings;

    @Column(name = "cooking_time", length = 50)  // cooking_time
    private String cookingTime;

    @Column(name = "difficulty", length = 50)  // difficulty
    private String difficulty;

    @Column(name = "ingredient_content", columnDefinition = "TEXT")  // ingredient_content
    private String ingredientContent;

    @Column(name = "hashtag", columnDefinition = "TEXT")  // hashtag
    private String hashtags;

    @Column(name = "by_type", length = 50)  // by_type
    private String category;

    @Column(name = "by_situation", length = 50)  // by_situation
    private String situation;

    @Column(name = "by_ingredient", length = 50)  // by_ingredient
    private String ingredientType;

    @Column(name = "by_method", length = 50)  // by_method
    private String method;
}
