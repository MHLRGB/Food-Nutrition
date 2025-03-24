package com.example.TestSecurity.service;

import com.example.TestSecurity.dto.recipe.IngredientRequestDTO;
import com.example.TestSecurity.dto.recipe.IngredientsInfoResponseDTO;
import com.example.TestSecurity.dto.recipe.RecipeIngredientsResponseDTO;
import com.example.TestSecurity.dto.recipe.RecipeRequestDTO;
import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.entity.RecipeIngredients;
import com.example.TestSecurity.repository.IngredientsRepository;
import com.example.TestSecurity.repository.RecipeIngredientsRepository;
import com.example.TestSecurity.repository.RecipeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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

    @Transactional
    public RecipeIngredientsResponseDTO createRecipe(RecipeRequestDTO recipeRequestDTO) {

        // 접속중인 사용자 이름 반환
        String author = SecurityContextHolder.getContext().getAuthentication().getName();

        // 레시피 저장
        Recipe recipe = new Recipe();
        recipe.setRecipeTitle(recipeRequestDTO.getRecipeTitle());
        recipe.setRecipeInfo(recipeRequestDTO.getRecipeInfo());
        recipe.setViews(recipeRequestDTO.getViews() != null ? recipeRequestDTO.getViews() : 0); // views는 null일 경우 기본값 0으로 설정
        recipe.setChef(author); // author를 chef로 설정
        recipe.setServing(recipeRequestDTO.getServing() != null ? recipeRequestDTO.getServing() : null);
        recipe.setCookingTime(recipeRequestDTO.getCookingTime() != null ? recipeRequestDTO.getCookingTime() : null);
        recipe.setDifficulty(recipeRequestDTO.getDifficulty() != null ? recipeRequestDTO.getDifficulty() : null);
        recipe.setHashtag(recipeRequestDTO.getHashtag() != null ? recipeRequestDTO.getHashtag() : null);
        recipe.setByType(recipeRequestDTO.getByType());
        recipe.setBySituation(recipeRequestDTO.getBySituation());
        recipe.setByIngredient(recipeRequestDTO.getByIngredient());
        recipe.setByMethod(recipeRequestDTO.getByMethod());
        recipe.setSourceType("user");
        Recipe savedRecipe = recipeRepository.save(recipe);

        List<IngredientRequestDTO> ingredients = recipeRequestDTO.getIngredients();

        // 재료 저장
        for (IngredientRequestDTO ingredientRequestDTO : ingredients) {
            RecipeIngredients recipeIngredients = new RecipeIngredients();

            // RecipeIngredientsId 객체 생성 및 설정
            RecipeIngredients.RecipeIngredientsId id = new RecipeIngredients.RecipeIngredientsId();

            id.setRecipeId(savedRecipe.getRecipeId());

            // ingredientId가 null인 경우 99999로 설정
            Long ingredientId = ingredientRequestDTO.getIngredientId();
            if (ingredientId == null) {
                ingredientId = 99999L;  // 99999로 설정
            }
            Long maxId = recipeIngredientsRepository.findMaxId(); // 쿼리 메서드를 사용해 최대 id 값을 가져옴
            if (maxId == null) {
                maxId = 1L;  // 데이터가 없을 경우 기본값으로 1 설정
            } else {
                maxId += 1;
            }
            id.setId(maxId);

            id.setIngredientId(ingredientId);
            id.setSection(ingredientRequestDTO.getSection());
            // RecipeIngredients 객체 설정
            recipeIngredients.setRecipe(savedRecipe);  // Recipe 엔티티 설정
            Ingredients ingredient = ingredientsRepository.findById(ingredientId)
                    .orElseThrow(() -> new IllegalArgumentException("createRecipeWithIngredients() : Invalid Ingredient ID"));
            recipeIngredients.setIngredient(ingredient);  // Ingredient 엔티티 설정

            recipeIngredients.setId(id);  // RecipeIngredientsId 설정

            // recipeIngredients.setSection(ingredientRequestDTO.getSection());
            recipeIngredients.setIngredientName(ingredientRequestDTO.getIngredientName());
            recipeIngredients.setQuantity(ingredientRequestDTO.getQuantity());
            recipeIngredients.setUnit(ingredientRequestDTO.getUnit());
            recipeIngredientsRepository.save(recipeIngredients);
        }

        return getRecipeIngredientsResponseDTO(savedRecipe);
    }



    @Transactional
    public RecipeIngredientsResponseDTO updateRecipe(Long id, RecipeRequestDTO recipeRequestDTO) {
        // 레시피 가져오기
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Recipe not found"));

        // 레시피 정보 업데이트
        recipe.setRecipeTitle(recipeRequestDTO.getRecipeTitle());
        recipe.setRecipeInfo(recipeRequestDTO.getRecipeInfo());
        recipe.setViews(recipeRequestDTO.getViews() != null ? recipeRequestDTO.getViews() : 0); // views는 null일 경우 기본값 0으로 설정
        recipe.setServing(recipeRequestDTO.getServing() != null ? recipeRequestDTO.getServing() : null);
        recipe.setCookingTime(recipeRequestDTO.getCookingTime() != null ? recipeRequestDTO.getCookingTime() : null);
        recipe.setDifficulty(recipeRequestDTO.getDifficulty() != null ? recipeRequestDTO.getDifficulty() : null);
        recipe.setHashtag(recipeRequestDTO.getHashtag() != null ? recipeRequestDTO.getHashtag() : null);
        recipe.setByType(recipeRequestDTO.getByType());
        recipe.setBySituation(recipeRequestDTO.getBySituation());
        recipe.setByIngredient(recipeRequestDTO.getByIngredient());
        recipe.setByMethod(recipeRequestDTO.getByMethod());

        // 레시피 저장
        Recipe updatedRecipe = recipeRepository.save(recipe);

        // 기존 재료 삭제
        recipeIngredientsRepository.deleteById_RecipeId(updatedRecipe.getRecipeId());

        // 새로운 재료 저장
        List<IngredientRequestDTO> ingredientRequestDTOs = recipeRequestDTO.getIngredients();

        for (IngredientRequestDTO ingredientRequestDTO : ingredientRequestDTOs) {
            RecipeIngredients recipeIngredients = new RecipeIngredients();
            RecipeIngredients.RecipeIngredientsId recipeIngredientsId = new RecipeIngredients.RecipeIngredientsId();

            recipeIngredientsId.setRecipeId(updatedRecipe.getRecipeId());
            recipeIngredientsId.setIngredientId(ingredientRequestDTO.getIngredientId());
            recipeIngredientsId.setSection(ingredientRequestDTO.getSection());


            Ingredients ingredient = ingredientsRepository.findById(ingredientRequestDTO.getIngredientId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Ingredient ID"));

            Long maxId = recipeIngredientsRepository.findMaxId(); // 쿼리 메서드를 사용해 최대 id 값을 가져옴
            if (maxId == null) {
                maxId = 1L;  // 데이터가 없을 경우 기본값으로 1 설정
            } else {
                maxId += 1;
            }
            recipeIngredientsId.setId(maxId);

            recipeIngredients.setId(recipeIngredientsId);
            recipeIngredients.setRecipe(updatedRecipe);
            recipeIngredients.setIngredient(ingredient);
            // recipeIngredients.setSection(ingredientRequestDTO.getSection());
            recipeIngredients.setIngredientName(ingredientRequestDTO.getIngredientName());
            recipeIngredients.setQuantity(ingredientRequestDTO.getQuantity());
            recipeIngredients.setUnit(ingredientRequestDTO.getUnit());

            recipeIngredientsRepository.save(recipeIngredients);
        }

        return getRecipeIngredientsResponseDTO(updatedRecipe);
    }


    public Page<Recipe> getAllRecipes(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size); // Spring Data JPA는 0부터 시작
        return recipeRepository.findAll(pageable);
    }

    public Page<Recipe> getAllMyRecipes(String author, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size); // 페이지 번호는 0부터 시작
        return recipeRepository.findByChef(author, pageable);
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


    // recipeId를 받아서 IngredientsInfoResponseDTO 리스트를 반환
    private RecipeIngredientsResponseDTO getRecipeIngredientsResponseDTO(Recipe recipe) {

        // RecipeIngredientsResponseDTO 객체 생성
        RecipeIngredientsResponseDTO recipeIngredientsResponseDTO = new RecipeIngredientsResponseDTO();
        recipeIngredientsResponseDTO.setRecipeId(recipe.getRecipeId()); // recipe_id
        recipeIngredientsResponseDTO.setRecipeTitle(recipe.getRecipeTitle()); // recipe_title
        recipeIngredientsResponseDTO.setRecipeInfo(recipe.getRecipeInfo()); // recipe_info
        recipeIngredientsResponseDTO.setViews(recipe.getViews()); // views
        recipeIngredientsResponseDTO.setChef(recipe.getChef()); // chef
        recipeIngredientsResponseDTO.setServing(recipe.getServing()); // serving
        recipeIngredientsResponseDTO.setCookingTime(recipe.getCookingTime()); // cooking_time
        recipeIngredientsResponseDTO.setDifficulty(recipe.getDifficulty()); // difficulty
        recipeIngredientsResponseDTO.setHashtag(recipe.getHashtag()); // hashtag
        recipeIngredientsResponseDTO.setByType(recipe.getByType()); // by_type
        recipeIngredientsResponseDTO.setBySituation(recipe.getBySituation()); // by_situation
        recipeIngredientsResponseDTO.setByIngredient(recipe.getByIngredient()); // by_ingredient
        recipeIngredientsResponseDTO.setByMethod(recipe.getByMethod()); // by_method

        List<IngredientsInfoResponseDTO> IngredientsInfoResponseDTOs = recipeIngredientsRepository.findById_RecipeId(recipe.getRecipeId()).stream()
                .map(recipeIngredient -> {
                    // IngredientsInfoResponseDTO 객체 생성
                    IngredientsInfoResponseDTO ingredientsInfoResponseDTO = new IngredientsInfoResponseDTO();

                    // IngredientsInfoResponseDTO 필드 설정
                    ingredientsInfoResponseDTO.setIngredientId(recipeIngredient.getId().getIngredientId());
                    ingredientsInfoResponseDTO.setSection(recipeIngredient.getId().getSection());
//                    ingredientsInfoResponseDTO.setIngredientInfo(ingredientResponseDTO);
                    ingredientsInfoResponseDTO.setIngredientName(recipeIngredient.getIngredientName());
                    ingredientsInfoResponseDTO.setQuantity(recipeIngredient.getQuantity());
//                    ingredientsInfoResponseDTO.setUnit(recipeIngredient.getSection());
                    ingredientsInfoResponseDTO.setUnit(recipeIngredient.getUnit());

                    return ingredientsInfoResponseDTO;
                })
                .collect(Collectors.toList());

        recipeIngredientsResponseDTO.setIngredientsInfo(IngredientsInfoResponseDTOs);

        return recipeIngredientsResponseDTO;
    }

    //    public List<Recipe> getTop3PopularRecipes() {
//        Pageable pageable = PageRequest.of(0, 3);
//        return recipeRepository.findTop3ByViews(pageable);
//    }

    // Community 관련 주석 처리
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

    //    @Transactional
//    public Recipe updateOrCreateRecipe(Community community, RecipeRequestDTO recipeRequestDTO) {
//        System.out.println("업데이트 커뮤니티 레시피 서비스 메소드 호출");
//
//        // 커뮤니티에서 레시피 가져오기
//        Recipe recipe = community.getRecipe();
//
//        if (recipe == null) {
//            // 레시피가 없으면 새로 생성
//            recipe = new Recipe();
//            recipe.setChef(community.getAuthor());
//        } else {
//            // 레시피가 있으면 기존 재료 삭제
//            recipeIngredientsRepository.deleteById_RecipeId(recipe.getRecipeId());
//        }
//
//        // 레시피 정보 생성 or 업데이트
//        recipe.setRecipeTitle(recipeRequestDTO.getRecipeTitle());
//        recipe.setRecipeInfo(recipeRequestDTO.getRecipeInfo());
//        recipe.setViews(recipeRequestDTO.getViews() != null ? recipeRequestDTO.getViews() : 0); // views는 null일 경우 기본값 0으로 설정
//        recipe.setServing(recipeRequestDTO.getServing() != null ? recipeRequestDTO.getServing() : null);
//        recipe.setCookingTime(recipeRequestDTO.getCookingTime() != null ? recipeRequestDTO.getCookingTime() : null);
//        recipe.setDifficulty(recipeRequestDTO.getDifficulty() != null ? recipeRequestDTO.getDifficulty() : null);
//        recipe.setHashtag(recipeRequestDTO.getHashtag() != null ? recipeRequestDTO.getHashtag() : null);
//        recipe.setByType(recipeRequestDTO.getByType());
//        recipe.setBySituation(recipeRequestDTO.getBySituation());
//        recipe.setByIngredient(recipeRequestDTO.getByIngredient());
//        recipe.setByMethod(recipeRequestDTO.getByMethod());
//        // 레시피 저장
//        Recipe savedRecipe = recipeRepository.save(recipe);
//
//        // 레시피 ID가 null인지 확인
//        if (savedRecipe.getRecipeId() == null) {
//            throw new IllegalStateException("저장된 레시피의 ID가 null입니다.");
//        }
//
//
//        // 새로운 재료 저장
//        if (recipeRequestDTO.getIngredients() != null) {
//            for (IngredientRequestDTO ingredientRequestDTO : recipeRequestDTO.getIngredients()) {
//                if (ingredientRequestDTO.getIngredientId() == null) {
//                    throw new IllegalArgumentException("재료 ID는 null일 수 없습니다.");
//                }
//
//                RecipeIngredients recipeIngredients = new RecipeIngredients();
//                RecipeIngredients.RecipeIngredientsId recipeIngredientsId = new RecipeIngredients.RecipeIngredientsId();
//
//                recipeIngredientsId.setRecipeId(savedRecipe.getRecipeId());
//                recipeIngredientsId.setIngredientId(ingredientRequestDTO.getIngredientId());
//
//                Ingredients ingredient = ingredientsRepository.findById(ingredientRequestDTO.getIngredientId())
//                        .orElseThrow(() -> new IllegalArgumentException("Invalid Ingredient ID"));
//
//                recipeIngredients.setId(recipeIngredientsId);
//                recipeIngredients.setRecipe(savedRecipe);
//                recipeIngredients.setIngredient(ingredient);
//                recipeIngredients.setQuantity(ingredientRequestDTO.getQuantity());
//
//                recipeIngredientsRepository.save(recipeIngredients);
//            }
//        }
//
//        return savedRecipe;
//    }

}
