package com.example.TestSecurity.service;

import com.example.TestSecurity.dto.IngredientRequestDTO;
import com.example.TestSecurity.dto.IngredientResponseDTO;
import com.example.TestSecurity.dto.IngredientsInfoResponseDTO;
import com.example.TestSecurity.dto.RecipeIngredientsResponseDTO;
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
    public CommunityService(RecipeRepository recipeRepository, IngredientsRepository ingredientsRepository, RecipeIngredientsRepository recipeIngredientsRepository, CommunityRepository communityRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientsRepository = ingredientsRepository;
        this.recipeIngredientsRepository = recipeIngredientsRepository;
        this.communityRepository = communityRepository;
    }

    public Long createCommunity(String title, String author, String content, String category) {
        Community community = new Community();
        community.setTitle(title);
        community.setAuthor(author);
        community.setContent(content);
        community.setCategory(category);

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

    public RecipeIngredientsResponseDTO getRecipeByIdIG(long recipeId) {
        // 레시피 찾기
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        // RecipeIngredientsResponseDTO 객체 생성
        RecipeIngredientsResponseDTO recipeIngredientsResponseDTO = new RecipeIngredientsResponseDTO();
        recipeIngredientsResponseDTO.setId(recipe.getId());
        recipeIngredientsResponseDTO.setTitle(recipe.getTitle());
        recipeIngredientsResponseDTO.setAuthor(recipe.getAuthor());
        recipeIngredientsResponseDTO.setCategory(recipe.getCategory());
        recipeIngredientsResponseDTO.setContent(recipe.getContent());
        recipeIngredientsResponseDTO.setViews(recipe.getViews());
        recipeIngredientsResponseDTO.setLikes(recipe.getLikes());
        recipeIngredientsResponseDTO.setCreatedDate(recipe.getCreatedDate());

        // RecipeIngredientsRepository를 사용하여 재료 정보 가져오기
        List<IngredientsInfoResponseDTO> ingredientsInfoResponseDTOs = recipeIngredientsRepository.findById_RecipeId(recipeId).stream()
                .map(recipeIngredient -> {
                    // IngredientsInfoResponseDTO 객체 생성
                    IngredientsInfoResponseDTO ingredientsInfoResponseDTO = new IngredientsInfoResponseDTO();

                    // IngredientResponseDTO 객체 생성
                    IngredientResponseDTO ingredientResponseDTO = new IngredientResponseDTO();
                    Ingredients ingredient = recipeIngredient.getIngredient();

                    // IngredientResponseDTO 필드 설정
                    ingredientResponseDTO.setIngredientsID(ingredient.getId());
                    ingredientResponseDTO.setName(ingredient.getFoodName()); // 필드명 변경
                    ingredientResponseDTO.setCal(ingredient.getEnergyKcal()); // 필드명 변경
                    ingredientResponseDTO.setCarbohydrates(ingredient.getCarbohydrateG()); // 필드명 추가
                    ingredientResponseDTO.setSugars(ingredient.getSugarG()); // 필드명 추가
                    ingredientResponseDTO.setProtein(ingredient.getProteinG()); // 필드명 변경
                    ingredientResponseDTO.setFat(ingredient.getFatG()); // 필드명 변경
                    ingredientResponseDTO.setSodium(ingredient.getSodiumMg()); // 필드명 추가

                    // IngredientsInfoResponseDTO 필드 설정
                    ingredientsInfoResponseDTO.setIngredientInfo(ingredientResponseDTO);
                    ingredientsInfoResponseDTO.setQuantity(recipeIngredient.getQuantity());

                    return ingredientsInfoResponseDTO;
                })
                .collect(Collectors.toList());

        // RecipeIngredientsResponseDTO에 재료 정보 설정
        recipeIngredientsResponseDTO.setIngredients(ingredientsInfoResponseDTOs);

        return recipeIngredientsResponseDTO;
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
