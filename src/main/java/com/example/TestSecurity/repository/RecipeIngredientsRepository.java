package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.RecipeIngredients;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeIngredientsRepository extends JpaRepository<RecipeIngredients, RecipeIngredients.RecipeIngredientsId> {
}
