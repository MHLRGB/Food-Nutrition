package com.example.TestSecurity.service;

import com.example.TestSecurity.dto.IngredientResponseDTO;
import com.example.TestSecurity.dto.IngredientSearchDTO;
import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.repository.IngredientsRepository;
import com.example.TestSecurity.repository.RecipeIngredientsRepository;
import com.example.TestSecurity.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IngredientService {

    private final RecipeRepository recipeRepository;

    private final IngredientsRepository ingredientsRepository;

    private final RecipeIngredientsRepository recipeIngredientsRepository;

    @Autowired
    public IngredientService(RecipeRepository recipeRepository, IngredientsRepository ingredientsRepository, RecipeIngredientsRepository recipeIngredientsRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientsRepository = ingredientsRepository;
        this.recipeIngredientsRepository = recipeIngredientsRepository;
    }
 public Optional<Ingredients> getIngredientById(Long id) {
        return ingredientsRepository.findById(id);
    }

    public List<IngredientSearchDTO> searchIngredients(String keyword) {
        List<Ingredients> ingredientsList = ingredientsRepository.findTop5ByFoodNameContainingIgnoreCase(keyword);
        return ingredientsList.stream()
                .map(ingredient -> new IngredientSearchDTO(ingredient.getId(), ingredient.getFoodName()))
                .collect(Collectors.toList());
    }

}
