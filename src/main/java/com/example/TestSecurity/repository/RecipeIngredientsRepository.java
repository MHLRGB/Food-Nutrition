package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.RecipeIngredients;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeIngredientsRepository extends JpaRepository<RecipeIngredients, RecipeIngredients.RecipeIngredientsId> {

    List<RecipeIngredients> findById_RecipeId(Long recipeId);
}
