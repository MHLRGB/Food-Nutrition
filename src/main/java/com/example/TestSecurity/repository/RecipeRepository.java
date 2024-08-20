package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.entity.RecipeIngredients;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @Query("SELECT c FROM Recipe c ORDER BY c.views DESC")
    List<Recipe> findTop3ByViews(Pageable pageable);
}

