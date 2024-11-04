package com.example.TestSecurity.controller;

import com.example.TestSecurity.dto.RecipeIngredientsResponseDTO;
import com.example.TestSecurity.dto.RecipeRequestDTO;
import com.example.TestSecurity.dto.RecipeResponseDTO;
import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.service.IngredientProcessService;
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
@RequestMapping("/api/recipe")
public class RecipeController {

    private final RecipeService recipeService;
    private final IngredientProcessService ingredientProcessService;

    @Autowired
    public RecipeController(RecipeService recipeService, IngredientProcessService ingredientProcessService) {
        this.recipeService = recipeService;
        this.ingredientProcessService = ingredientProcessService;
    }

    @PostMapping
    public ResponseEntity<RecipeIngredientsResponseDTO> createRecipe(@RequestBody RecipeRequestDTO recipeRequestDTO) {

        try {

            RecipeIngredientsResponseDTO createdRecipe = recipeService.createRecipe(recipeRequestDTO);

            return new ResponseEntity<>(createdRecipe, HttpStatus.OK);

        } catch (Exception e) {
            // 예외 발생 시 400 반환
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
            dto.setAuthor(Recipe.getAuthor());
            dto.setCategory(Recipe.getCategory());
            dto.setCreatedDate(Recipe.getCreatedDate());
            return dto;
        }).collect(Collectors.toList());

        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }





    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipeById(@PathVariable long id) {
        try {
            System.out.println("삭제 컨트롤러 아이디 : " + id);
            recipeService.deleteRecipeById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeIngredientsResponseDTO> updateRecipe(
            @PathVariable Long id,
            @RequestBody RecipeRequestDTO requestDTO) {
        try {
            // 커뮤니티 정보 가져오기
            Optional<Recipe> optionalRecipe = recipeService.getRecipeById(id);

            if (optionalRecipe.isPresent()) {

                // 업데이트된 레시피 저장
                RecipeIngredientsResponseDTO updatedRecipe = recipeService.updateRecipe(id, requestDTO);

                return new ResponseEntity<>(updatedRecipe, HttpStatus.OK);
            } else {
                // 레시피를 찾지 못한 경우 404 반환
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // 예외 발생 시 400 반환
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeIngredientsResponseDTO> getRecipeById(@PathVariable long id) {

        Optional<Recipe> recipe = recipeService.getRecipeById(id);
        if (recipe.isPresent()) {

            RecipeIngredientsResponseDTO RecipeIngredientsResponseDTO = recipeService.getRecipeByIdIG(id);

            return new ResponseEntity<>(RecipeIngredientsResponseDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/process-data")
    public String processData() {

        // 괄호 내용 추출 & 저장
        List<String> extractedData = ingredientProcessService.extractBracketContents();

        return "추출된 데이터: " + String.join(", ", extractedData);
    }


    //
//    @GetMapping("/top-popular-recipe")
//    public ResponseEntity<List<RecipeResponseDTO>> getTop3PopularRecipes() {
//        List<Recipe> recipes = recipeService.getTop3PopularRecipes();
//        List<RecipeResponseDTO> responseDTOs = recipes.stream()
//                .map(recipe -> {
//                    RecipeResponseDTO dto = new RecipeResponseDTO();
//                    dto.setId(recipe.getId());
//                    dto.setTitle(recipe.getTitle());
//                    dto.setAuthor(recipe.getAuthor());
//                    dto.setCategory(recipe.getCategory());
//                    dto.setCreatedDate(recipe.getCreatedDate());
//                    return dto;
//                })
//                .collect(Collectors.toList());
//        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
//    }

//    @GetMapping("/{id}")
//    public ResponseEntity<RecipeResponseDTO> getRecipeById(@PathVariable int id) {
//        Optional<Recipe> recipe = recipeService.getRecipeById(id);
//        if (recipe.isPresent()) {
//            RecipeResponseDTO responseDTO = new RecipeResponseDTO();
//            responseDTO.setId(recipe.get().getId());
//            responseDTO.setTitle(recipe.get().getTitle());
//            responseDTO.setContent(recipe.get().getContent());
//            responseDTO.setAuthor(recipe.get().getAuthor());
//            responseDTO.setCategory(recipe.get().getCategory());
//            responseDTO.setCreatedDate(recipe.get().getCreatedDate());
//
//            // 조회수 증가
//            recipeService.incrementViews(id);
//
//            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }
}
