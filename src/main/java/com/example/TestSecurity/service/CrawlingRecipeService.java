//package com.example.TestSecurity.service;
//
//import com.example.TestSecurity.dto.IngredientRequestDTO;
//import com.example.TestSecurity.dto.IngredientsInfoResponseDTO;
//import com.example.TestSecurity.dto.RecipeIngredientsResponseDTO;
//import com.example.TestSecurity.dto.RecipeRequestDTO;
//import com.example.TestSecurity.dto.crawling.UTIIngredientsInfoResponseDTO;
//import com.example.TestSecurity.dto.crawling.UTIResponseDTO;
//import com.example.TestSecurity.entity.*;
//import com.example.TestSecurity.repository.*;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.NoSuchElementException;
//import java.util.Optional;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//import java.util.stream.Collectors;
//
//@Service
//public class CrawlingRecipeService {
//
//    private final TestCrawlingRecipeRepository testCrawlingRecipeRepository;
//
//    private final IngredientsRepository ingredientsRepository;
//
//    private final UnitTestIngredientsProcessIngredientMatchTestRepository UTIRepository;
//
//    @Autowired
//    public CrawlingRecipeService(IngredientsRepository ingredientsRepository, TestCrawlingRecipeRepository testCrawlingRecipeRepository, com.example.TestSecurity.repository.UnitTestIngredientsProcessIngredientMatchTestRepository unitTestIngredientsProcessIngredientMatchTestRepository) {
//
//        this.ingredientsRepository = ingredientsRepository;
//
//        this.testCrawlingRecipeRepository = testCrawlingRecipeRepository;
//        UTIRepository = unitTestIngredientsProcessIngredientMatchTestRepository;
//    }
//
//    public RecipeIngredientsResponseDTO getRecipeByIdIG(long recipeId) {
//        // 레시피 찾기
//        TestCrawlingRecipe recipe = testCrawlingRecipeRepository.findById(recipeId)
//                .orElseThrow(() -> new RuntimeException("Recipe not found"));
//
//        return getCrawlingRecipeIngredientsResponseDTO(recipe);
//    }
//
//
//
//    // recipeId를 받아서 IngredientsInfoResponseDTO 리스트를 반환
//    private UTIResponseDTO getCrawlingRecipeIngredientsResponseDTO(TestCrawlingRecipe recipe) {
//
//        // RecipeIngredientsResponseDTO 객체 생성
//        UTIResponseDTO utiResponseDTO = new UTIResponseDTO();
//        utiResponseDTO.setId(recipe.getId());
//        utiResponseDTO.setRecipeNumber(recipe.getRecipeNumber());
//        utiResponseDTO.setRecipeTitle(recipe.getRecipeTitle());
//        utiResponseDTO.setRecipeInfo(recipe.getRecipeInfo());
//        utiResponseDTO.setViews(recipe.getViews());
//        utiResponseDTO.setChef(recipe.getChef());
//        utiResponseDTO.setServings(recipe.getServings());
//        utiResponseDTO.setCookingTime(recipe.getCookingTime());
//        utiResponseDTO.setDifficulty(recipe.getDifficulty());
//        utiResponseDTO.setHashtags(recipe.getHashtags());
//        utiResponseDTO.setCategory(recipe.getCategory());
//        utiResponseDTO.setSituation(recipe.getSituation());
//        utiResponseDTO.setIngredientType(recipe.getIngredientType());
//        utiResponseDTO.setMethod(recipe.getMethod());
//
//
//        List<UTIIngredientsInfoResponseDTO> IngredientsInfoResponseDTOs = UTIRepository.findById_RecipeId(recipe.getId()).stream()
//                .map(recipeIngredient -> {
//                    // IngredientsInfoResponseDTO 객체 생성
//                    UTIIngredientsInfoResponseDTO ingredientsInfoResponseDTO = new UTIIngredientsInfoResponseDTO();
//
//                    // IngredientsInfoResponseDTO 필드 설정
//                    ingredientsInfoResponseDTO.setIngredientId(recipeIngredient.getId().getIngredientId());
////                    ingredientsInfoResponseDTO.setIngredientInfo(ingredientResponseDTO);
//                    ingredientsInfoResponseDTO.setQuantity(recipeIngredient.getQuantity());
//                    ingredientsInfoResponseDTO.setUnit(recipeIngredient.getUnit());
//                    ingredientsInfoResponseDTO.setSection(recipeIngredient.getId().getSection());
//
//                    return ingredientsInfoResponseDTO;
//                })
//                .collect(Collectors.toList());
//
//        utiResponseDTO.setIngredientsInfo(IngredientsInfoResponseDTOs);
//
//        return utiResponseDTO;
//    }
//
//}
