package com.example.TestSecurity.service;

import com.example.TestSecurity.dto.IngredientDTO;
import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.entity.RecipeIngredients;
import com.example.TestSecurity.repository.IngredientsRepository;
import com.example.TestSecurity.repository.RecipeIngredientsRepository;
import com.example.TestSecurity.repository.RecipeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    private final IngredientsRepository ingredientsRepository;

    private final RecipeIngredientsRepository recipeIngredientsRepository;

    @Autowired
    public RecipeService(RecipeRepository recipeRepository, IngredientsRepository ingredientsRepository, RecipeIngredientsRepository recipeIngredientsRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientsRepository = ingredientsRepository;
        this.recipeIngredientsRepository = recipeIngredientsRepository;
    }

    public Recipe saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    @Transactional
    public Long createRecipeWithIngredients(String title, String author, String content, String category, List<IngredientDTO> ingredients) {
        // 레시피 저장
        Recipe recipe = new Recipe();
        recipe.setTitle(title);
        recipe.setAuthor(author);
        recipe.setContent(content);
        recipe.setCategory(category);
        Recipe savedRecipe = recipeRepository.save(recipe);

        // 재료 저장
        for (IngredientDTO ingredientDTO : ingredients) {
            RecipeIngredients recipeIngredients = new RecipeIngredients();
            RecipeIngredients.RecipeIngredientsId id = new RecipeIngredients.RecipeIngredientsId();
            id.setRecipeId(savedRecipe.getId());
            id.setIngredientId(ingredientDTO.getIngredientId());
            recipeIngredients.setId(id);
            recipeIngredients.setQuantity(ingredientDTO.getQuantity());
            recipeIngredientsRepository.save(recipeIngredients);
        }

        return savedRecipe.getId();
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
