package com.example.TestSecurity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 20)
    private Long recipeId;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredients> recipeIngredients = new ArrayList<>();

    private String recipeTitle;

    @Lob
    private String recipeInfo;

    private Integer views;

    private String chef;

    private String serving;

    private String cookingTime;

    private String difficulty;

    @Lob
    private String hashtag;

    private String byType;

    private String bySituation;

    private String byIngredient;

    private String byMethod;
}