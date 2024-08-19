package com.example.TestSecurity.service;

import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.repository.IngredientsRepository;
import com.example.TestSecurity.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    private final IngredientsRepository ingredientsRepository;

    @Autowired
    public RecipeService(RecipeRepository recipeRepository, IngredientsRepository ingredientsRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientsRepository = ingredientsRepository;
    }

    public Recipe saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public Optional<Recipe> getRecipeById(long id) {
        return recipeRepository.findById(id);
    }

    public void deleteRecipeById(long id) {
        recipeRepository.deleteById(id);
    }

    public Optional<Ingredients> getIngredientById(Long id) {
        return ingredientsRepository.findById(id);
    }

    public Recipe incrementViews(long id) {
        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
        if (optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();
            recipe.setViews(recipe.getViews() + 1);
            return recipeRepository.save(recipe);
        }
        return null;
    }

    public List<Recipe> getTop3PopularRecipes() {
        Pageable pageable = PageRequest.of(0, 3);
        return recipeRepository.findTop3ByViews(pageable);
    }

}
