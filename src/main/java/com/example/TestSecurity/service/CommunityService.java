package com.example.TestSecurity.service;

import com.example.TestSecurity.dto.*;
import com.example.TestSecurity.entity.Community;
import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.entity.RecipeIngredients;
import com.example.TestSecurity.repository.CommunityRepository;
import com.example.TestSecurity.repository.IngredientsRepository;
import com.example.TestSecurity.repository.RecipeIngredientsRepository;
import com.example.TestSecurity.repository.RecipeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private final RecipeRepository recipeRepository;

    private final IngredientsRepository ingredientsRepository;

    private final RecipeIngredientsRepository recipeIngredientsRepository;

    private final CommunityRepository communityRepository;

    @Autowired
    private RecipeService recipeService;

    @Autowired
    public CommunityService(RecipeRepository recipeRepository, IngredientsRepository ingredientsRepository, RecipeIngredientsRepository recipeIngredientsRepository, CommunityRepository communityRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientsRepository = ingredientsRepository;
        this.recipeIngredientsRepository = recipeIngredientsRepository;
        this.communityRepository = communityRepository;
    }

    public Long createCommunity(String title, String author, String content, String category, RecipeRequestDTO recipeRequestDTO) {

        Recipe savedRecipe = null;

        if (recipeRequestDTO != null) {
            savedRecipe = recipeService.createRecipeWithIngredients(
                    recipeRequestDTO.getTitle(),
                    author,
                    recipeRequestDTO.getCategory(),
                    recipeRequestDTO.getIngredients()
            );
        }

//        Recipe savedRecipe = recipeService.createRecipeWithIngredients(recipeRequestDTO.getTitle(), recipeRequestDTO.getCategory(),recipeRequestDTO.getTitle(), recipeRequestDTO.getIngredients());

        Community community = new Community();
        community.setTitle(title);
        community.setAuthor(author);
        community.setContent(content);
        community.setCategory(category);
        community.setRecipe(savedRecipe);

        Community savedcommunity = communityRepository.save(community);


        return savedcommunity.getId();
    }

    public void saveCommunity(Community community) {
        communityRepository.save(community);
    }

    public void deleteCommunityById(long id) {
        communityRepository.deleteById(id);
    }

    public List<Community> getAllRecipes() {
        return communityRepository.findAll();
    }

    public Optional<Community> getCommunityById(long id) {
        return communityRepository.findById(id);
    }





    public void deleteRecipeById(long id) {
        System.out.println("삭제 서비스 아이디 : " + id);
        recipeRepository.deleteById(id);
    }

    public Optional<Ingredients> getIngredientById(Long id) {
        return ingredientsRepository.findById(id);
    }

    public Recipe incrementViews(long id) {
        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
        if (optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();
            return recipeRepository.save(recipe);
        }
        return null;
    }

//    public List<Recipe> getTop3PopularRecipes() {
//        Pageable pageable = PageRequest.of(0, 3);
//        return recipeRepository.findTop3ByViews(pageable);
//    }

}
