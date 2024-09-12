package com.example.TestSecurity.service;

import com.example.TestSecurity.dto.*;
import com.example.TestSecurity.entity.Community;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

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

//    @Transactional
//    public Recipe createRecipeWithIngredients(String author, RecipeRequestDTO recipeRequestDTO) {
//
//        // 레시피 저장
//        Recipe recipe = new Recipe();
//        recipe.setTitle(recipeRequestDTO.getTitle());
//        recipe.setAuthor(author);
//        recipe.setCategory(recipeRequestDTO.getCategory());
//
//        Recipe savedRecipe = recipeRepository.save(recipe);
//
//        List<IngredientRequestDTO> ingredients = recipeRequestDTO.getIngredients();
//
//        // 재료 저장
//        for (IngredientRequestDTO ingredientRequestDTO : ingredients) {
//            RecipeIngredients recipeIngredients = new RecipeIngredients();
//
//            RecipeIngredients.RecipeIngredientsId id = new RecipeIngredients.RecipeIngredientsId();
//            id.setRecipeId(savedRecipe.getId());
//            id.setIngredientId(ingredientRequestDTO.getIngredientId());
//
//            recipeIngredients.setRecipe(savedRecipe);  // Recipe 엔티티 설정
//            Ingredients ingredient = ingredientsRepository.findById(ingredientRequestDTO.getIngredientId())
//                    .orElseThrow(() -> new IllegalArgumentException("createRecipeWithIngredients() : Invalid Ingredient ID"));
//            recipeIngredients.setIngredient(ingredient);  // Ingredient 엔티티 설정
//
//
//            recipeIngredients.setId(id);
//            recipeIngredients.setQuantity(ingredientRequestDTO.getQuantity());
//            recipeIngredientsRepository.save(recipeIngredients);
//        }
//
//        return savedRecipe;
//    }

    @Transactional
    public RecipeIngredientsResponseDTO createRecipe(RecipeRequestDTO recipeRequestDTO) {

        // 접속중인 사용자 이름 반환
        String author = SecurityContextHolder.getContext().getAuthentication().getName();

        // 레시피 저장
        Recipe recipe = new Recipe();
        recipe.setTitle(recipeRequestDTO.getTitle());
        recipe.setAuthor(author);
        recipe.setContent(recipeRequestDTO.getContent());
        recipe.setCategory(recipeRequestDTO.getCategory());
        recipe.setViews(0);

        Recipe savedRecipe = recipeRepository.save(recipe);

        List<IngredientRequestDTO> ingredients = recipeRequestDTO.getIngredients();

        // 재료 저장
        for (IngredientRequestDTO ingredientRequestDTO : ingredients) {
            RecipeIngredients recipeIngredients = new RecipeIngredients();

            RecipeIngredients.RecipeIngredientsId id = new RecipeIngredients.RecipeIngredientsId();
            id.setRecipeId(savedRecipe.getId());
            id.setIngredientId(ingredientRequestDTO.getIngredientId());

            recipeIngredients.setRecipe(savedRecipe);  // Recipe 엔티티 설정
            Ingredients ingredient = ingredientsRepository.findById(ingredientRequestDTO.getIngredientId())
                    .orElseThrow(() -> new IllegalArgumentException("createRecipeWithIngredients() : Invalid Ingredient ID"));
            recipeIngredients.setIngredient(ingredient);  // Ingredient 엔티티 설정


            recipeIngredients.setId(id);
            recipeIngredients.setQuantity(ingredientRequestDTO.getQuantity());
            recipeIngredientsRepository.save(recipeIngredients);
        }

        return getRecipeIngredientsResponseDTO(savedRecipe);
    }


    @Transactional
    public RecipeIngredientsResponseDTO updateRecipe(Long id, RecipeRequestDTO requestDTO) {
        // 레시피 가져오기
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Recipe not found"));

        // 레시피 정보 업데이트
        recipe.setTitle(requestDTO.getTitle());
        recipe.setCategory(requestDTO.getCategory());

        // 레시피 저장
        Recipe updatedRecipe = recipeRepository.save(recipe);

        // 기존 재료 삭제
        recipeIngredientsRepository.deleteByRecipeId(updatedRecipe.getId());

        // 새로운 재료 저장
        List<IngredientRequestDTO> ingredientRequestDTOs = requestDTO.getIngredients();

        for (IngredientRequestDTO ingredientRequestDTO : ingredientRequestDTOs) {
            RecipeIngredients recipeIngredients = new RecipeIngredients();
            RecipeIngredients.RecipeIngredientsId recipeIngredientsId = new RecipeIngredients.RecipeIngredientsId();

            recipeIngredientsId.setRecipeId(updatedRecipe.getId());
            recipeIngredientsId.setIngredientId(ingredientRequestDTO.getIngredientId());

            Ingredients ingredient = ingredientsRepository.findById(ingredientRequestDTO.getIngredientId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Ingredient ID"));

            recipeIngredients.setId(recipeIngredientsId);
            recipeIngredients.setRecipe(updatedRecipe);
            recipeIngredients.setIngredient(ingredient);
            recipeIngredients.setQuantity(ingredientRequestDTO.getQuantity());

            recipeIngredientsRepository.save(recipeIngredients);
        }

        return getRecipeIngredientsResponseDTO(updatedRecipe);
    }

    @Transactional
    public Recipe updateOrCreateRecipe(Community community, RecipeRequestDTO recipeRequestDTO) {
        System.out.println("업데이트 커뮤니티 레시피 서비스 메소드 호출");

        // 커뮤니티에서 레시피 가져오기
        Recipe recipe = community.getRecipe();

        if (recipe == null) {
            // 레시피가 없으면 새로 생성
            recipe = new Recipe();
            recipe.setAuthor(community.getAuthor());
        } else {
            // 레시피가 있으면 기존 재료 삭제
            recipeIngredientsRepository.deleteByRecipeId(recipe.getId());
        }

        // 레시피 정보 생성 or 업데이트
        recipe.setTitle(recipeRequestDTO.getTitle());
        recipe.setContent(recipeRequestDTO.getContent());
        recipe.setCategory(recipeRequestDTO.getCategory());

        // 레시피 저장
        Recipe savedRecipe = recipeRepository.save(recipe);

        // 레시피 ID가 null인지 확인
        if (savedRecipe.getId() == null) {
            throw new IllegalStateException("저장된 레시피의 ID가 null입니다.");
        }


        // 새로운 재료 저장
        if (recipeRequestDTO.getIngredients() != null) {
            for (IngredientRequestDTO ingredientRequestDTO : recipeRequestDTO.getIngredients()) {
                if (ingredientRequestDTO.getIngredientId() == null) {
                    throw new IllegalArgumentException("재료 ID는 null일 수 없습니다.");
                }

                RecipeIngredients recipeIngredients = new RecipeIngredients();
                RecipeIngredients.RecipeIngredientsId recipeIngredientsId = new RecipeIngredients.RecipeIngredientsId();

                recipeIngredientsId.setRecipeId(savedRecipe.getId());
                recipeIngredientsId.setIngredientId(ingredientRequestDTO.getIngredientId());

                Ingredients ingredient = ingredientsRepository.findById(ingredientRequestDTO.getIngredientId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid Ingredient ID"));

                recipeIngredients.setId(recipeIngredientsId);
                recipeIngredients.setRecipe(savedRecipe);
                recipeIngredients.setIngredient(ingredient);
                recipeIngredients.setQuantity(ingredientRequestDTO.getQuantity());

                recipeIngredientsRepository.save(recipeIngredients);
            }
        }

        return savedRecipe;
    }

//
//    @Transactional
//    public Recipe updateRecipeWithIngredients(Long recipeid, String title, String author, String category, List<IngredientRequestDTO> ingredients) {
//        // 레시피 저장
//        Recipe recipe = new Recipe();
//        recipe.setTitle(title);
//        recipe.setAuthor(author);
//        recipe.setCategory(category);
//
//        Recipe savedRecipe = recipeRepository.save(recipe);
//
//        // 재료 저장
//        for (IngredientRequestDTO ingredientRequestDTO : ingredients) {
//            RecipeIngredients recipeIngredients = new RecipeIngredients();
//
//            RecipeIngredients.RecipeIngredientsId id = new RecipeIngredients.RecipeIngredientsId();
//            id.setRecipeId(savedRecipe.getId());
//            id.setIngredientId(ingredientRequestDTO.getIngredientId());
//
//            recipeIngredients.setRecipe(savedRecipe);  // Recipe 엔티티 설정
//            Ingredients ingredient = ingredientsRepository.findById(ingredientRequestDTO.getIngredientId())
//                    .orElseThrow(() -> new IllegalArgumentException("createRecipeWithIngredients() : Invalid Ingredient ID"));
//            recipeIngredients.setIngredient(ingredient);  // Ingredient 엔티티 설정
//
//
//            recipeIngredients.setId(id);
//            recipeIngredients.setQuantity(ingredientRequestDTO.getQuantity());
//            recipeIngredientsRepository.save(recipeIngredients);
//        }
//
//        return savedRecipe;
//    }

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public Optional<Recipe> getRecipeById(long id) {
        return recipeRepository.findById(id);
    }

    public RecipeIngredientsResponseDTO getRecipeByIdIG(long recipeId) {
        // 레시피 찾기
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        return getRecipeIngredientsResponseDTO(recipe);
    }



    public void deleteRecipeById(long id) {
        System.out.println("삭제 서비스 아이디 : " + id);
        recipeRepository.deleteById(id);
    }

    public Optional<Ingredients> getIngredientById(Long id) {
        return ingredientsRepository.findById(id);
    }

//    public List<Recipe> getTop3PopularRecipes() {
//        Pageable pageable = PageRequest.of(0, 3);
//        return recipeRepository.findTop3ByViews(pageable);
//    }

    // recipeId를 받아서 IngredientsInfoResponseDTO 리스트를 반환
    private RecipeIngredientsResponseDTO getRecipeIngredientsResponseDTO(Recipe recipe) {

        // RecipeIngredientsResponseDTO 객체 생성
        RecipeIngredientsResponseDTO recipeIngredientsResponseDTO = new RecipeIngredientsResponseDTO();
        recipeIngredientsResponseDTO.setId(recipe.getId());
        recipeIngredientsResponseDTO.setTitle(recipe.getTitle());
        recipeIngredientsResponseDTO.setAuthor(recipe.getAuthor());
        recipeIngredientsResponseDTO.setCategory(recipe.getCategory());
        recipeIngredientsResponseDTO.setLikes(recipe.getLikes());recipeIngredientsResponseDTO.setCreatedDate(recipe.getCreatedDate());

        List<IngredientsInfoResponseDTO> IngredientsInfoResponseDTOs = recipeIngredientsRepository.findById_RecipeId(recipe.getId()).stream()
                .map(recipeIngredient -> {
                    // IngredientsInfoResponseDTO 객체 생성
                    IngredientsInfoResponseDTO ingredientsInfoResponseDTO = new IngredientsInfoResponseDTO();

                    // IngredientsInfoResponseDTO 필드 설정
                    ingredientsInfoResponseDTO.setIngredientId(recipeIngredient.getId().getIngredientId());
//                    ingredientsInfoResponseDTO.setIngredientInfo(ingredientResponseDTO);
                    ingredientsInfoResponseDTO.setQuantity(recipeIngredient.getQuantity());

                    return ingredientsInfoResponseDTO;
                })
                .collect(Collectors.toList());

        recipeIngredientsResponseDTO.setIngredientsInfo(IngredientsInfoResponseDTOs);

        return recipeIngredientsResponseDTO;
    }

}
