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

    @Column(name = "recipeTitle")
    private String recipeTitle;

    @Column(name = "recipeInfo")
    private String recipeInfo;

    @Column(name = "views")
    private Integer views;

    @Column(name = "chef")
    private String chef;

    @Column(name = "serving")
    private String serving;

    @Column(name = "cookingTime")
    private String cookingTime;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "hashtag")
    private String hashtag;

    @Column(name = "byType")
    private String byType;

    @Column(name = "bySituation")
    private String bySituation;

    @Column(name = "byIngredient")
    private String byIngredient;

    @Column(name = "byMethod")
    private String byMethod;
}