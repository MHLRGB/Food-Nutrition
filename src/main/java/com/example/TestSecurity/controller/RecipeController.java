package com.example.TestSecurity.controller;

import com.example.TestSecurity.dto.RecipeRequestDTO;
import com.example.TestSecurity.dto.RecipeResponseDTO;
import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/recipe")
public class RecipeController {

    private final RecipeService recipeService;

    @Autowired
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @PostMapping
    public ResponseEntity<RecipeResponseDTO> createRecipe(@RequestBody RecipeRequestDTO requestDTO) {
        try {
            Recipe recipe = new Recipe();

            // 접속중인 사용자의 username 반환
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            recipe.setTitle(requestDTO.getTitle());
            recipe.setContent(requestDTO.getContent());
            recipe.setAuthor(username);
            recipe.setCategory(requestDTO.getCategory());
            recipe.setViews(0);
            Recipe savedRecipe = recipeService.saveRecipe(recipe);

            RecipeResponseDTO responseDTO = new RecipeResponseDTO();
            responseDTO.setId(savedRecipe.getId());
            responseDTO.setTitle(savedRecipe.getTitle());
            responseDTO.setContent(savedRecipe.getContent());
            responseDTO.setAuthor(savedRecipe.getAuthor());
            responseDTO.setCategory(savedRecipe.getCategory());
            responseDTO.setCreatedDate(savedRecipe.getCreatedDate());

            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<RecipeResponseDTO>> getAllRecipes() {
        List<Recipe> Recipes = recipeService.getAllRecipes();
        List<RecipeResponseDTO> responseDTOs = Recipes.stream().map(Recipe -> {
            RecipeResponseDTO dto = new RecipeResponseDTO();
            dto.setId(Recipe.getId());
            dto.setTitle(Recipe.getTitle());
            dto.setContent(Recipe.getContent());
            dto.setAuthor(Recipe.getAuthor());
            dto.setCategory(Recipe.getCategory());
            dto.setCreatedDate(Recipe.getCreatedDate());
            return dto;
        }).collect(Collectors.toList());

        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponseDTO> getRecipeById(@PathVariable int id) {
        Optional<Recipe> recipe = recipeService.getRecipeById(id);
        if (recipe.isPresent()) {
            RecipeResponseDTO responseDTO = new RecipeResponseDTO();
            responseDTO.setId(recipe.get().getId());
            responseDTO.setTitle(recipe.get().getTitle());
            responseDTO.setContent(recipe.get().getContent());
            responseDTO.setAuthor(recipe.get().getAuthor());
            responseDTO.setCategory(recipe.get().getCategory());
            responseDTO.setCreatedDate(recipe.get().getCreatedDate());

            // 조회수 증가
            recipeService.incrementViews(id);

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipeById(@PathVariable int id) {
        try {
            recipeService.deleteRecipeById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponseDTO> updateRecipe(
            @PathVariable int id,
            @RequestBody RecipeRequestDTO requestDTO) {
        try {
            // 커뮤니티 정보 가져오기
            Optional<Recipe> optionalCommunity = recipeService.getRecipeById(id);

            if (optionalCommunity.isPresent()) {
                Recipe recipe = optionalCommunity.get();

                // 기존 커뮤니티 정보 업데이트
                recipe.setTitle(requestDTO.getTitle());
                recipe.setContent(requestDTO.getContent());
                recipe.setAuthor(requestDTO.getAuthor());
                recipe.setCategory(requestDTO.getCategory());

                // 업데이트된 커뮤니티 저장
                Recipe updatedCommunity = recipeService.saveRecipe(recipe);

                // 응답 DTO 생성 및 설정
                RecipeResponseDTO responseDTO = new RecipeResponseDTO();
                responseDTO.setId(updatedCommunity.getId());
                responseDTO.setTitle(updatedCommunity.getTitle());
                responseDTO.setContent(updatedCommunity.getContent());
                responseDTO.setAuthor(updatedCommunity.getAuthor());
                responseDTO.setCategory(updatedCommunity.getCategory());
                responseDTO.setCreatedDate(updatedCommunity.getCreatedDate());

                return new ResponseEntity<>(responseDTO, HttpStatus.OK);
            } else {
                // 커뮤니티를 찾지 못한 경우 404 반환
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // 예외 발생 시 400 반환
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/top-popular-recipe")
    public ResponseEntity<List<RecipeResponseDTO>> getTop3PopularRecipes() {
        List<Recipe> recipes = recipeService.getTop3PopularRecipes();
        List<RecipeResponseDTO> responseDTOs = recipes.stream()
                .map(recipe -> {
                    RecipeResponseDTO dto = new RecipeResponseDTO();
                    dto.setId(recipe.getId());
                    dto.setTitle(recipe.getTitle());
                    dto.setContent(recipe.getContent());
                    dto.setAuthor(recipe.getAuthor());
                    dto.setCategory(recipe.getCategory());
                    dto.setCreatedDate(recipe.getCreatedDate());
                    return dto;
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }

    @GetMapping("/ingredient/{id}")
    public ResponseEntity<Ingredients> getIngredientById(@PathVariable(value = "id") Long id) {
        Optional<Ingredients> ingredient = recipeService.getIngredientById(id);
        return ingredient.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

}
