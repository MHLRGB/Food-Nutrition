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

//    @Id
//    @Column(name = "id", nullable = false)  // Primary key
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;

    @Id
    @Column(name = "recipeId", nullable = false)
    private Long recipeId;

    @Column(name = "recipeTitle", length = 255)
    private String recipeTitle;

    @Column(name = "recipeInfo", columnDefinition = "TEXT")
    private String recipeInfo;

    @Column(name = "views")  // views
    private Integer views;

    @Column(name = "chef", length = 100)  // chef
    private String chef;

    @Column(name = "serving", length = 50)  // serving
    private String servings;

    @Column(name = "cookingTime", length = 50)  // cooking_time
    private String cookingTime;

    @Column(name = "difficulty", length = 50)  // difficulty
    private String difficulty;

    @Column(name = "ingredientContent", columnDefinition = "TEXT")  // ingredient_content
    private String ingredientContent;

    @Column(name = "hashtag", columnDefinition = "TEXT")  // hashtag
    private String hashtag;

    @Column(name = "byType", length = 50)  // by_type
    private String byType;

    @Column(name = "bySituation", length = 50)  // by_situation
    private String bySituation;

    @Column(name = "byIngredient", length = 50)  // by_ingredient
    private String byIngredient;

    @Column(name = "byMethod", length = 50)  // by_method
    private String byMethod;
}
