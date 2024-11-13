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
    private Long recipe_id;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredients> recipeIngredients = new ArrayList<>();

    private String recipe_title;

    @Lob
    private String recipe_info;

    private Integer views;

    private String chef;

    private String serving;

    private String cooking_time;

    private String difficulty;

    @Lob
    private String hashtag;

    private String by_type;

    private String by_situation;

    private String by_ingredient;

    private String by_method;
}