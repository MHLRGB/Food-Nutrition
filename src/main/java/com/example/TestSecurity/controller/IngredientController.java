package com.example.TestSecurity.controller;

import com.example.TestSecurity.dto.CommunityResponseDTO;
import com.example.TestSecurity.dto.IngredientResponseDTO;
import com.example.TestSecurity.entity.Community;
import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ingredient")
public class IngredientController {

    private final IngredientService ingredientService;

    @Autowired
    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredientResponseDTO> getIngredientById(@PathVariable(value = "id") Long id) {
        Optional<Ingredients> ingredient = ingredientService.getIngredientById(id);

        if (ingredient.isPresent()) {
            Ingredients ing = ingredient.get(); // Ingredients 객체 가져오기

            IngredientResponseDTO responseDTO = new IngredientResponseDTO();
            responseDTO.setIngredientsID(ing.getId()); // id 필드 매핑
            responseDTO.setName(ing.getFoodName()); // name 필드 매핑
            responseDTO.setCal(ing.getEnergyKcal()); // cal 필드 매핑
            responseDTO.setCarbohydrates(ing.getCarbohydrateG()); // carbohydrates 필드 매핑
            responseDTO.setSugars(ing.getSugarG()); // sugars 필드 매핑
            responseDTO.setProtein(ing.getProteinG()); // protein 필드 매핑
            responseDTO.setFat(ing.getFatG()); // fat 필드 매핑
            responseDTO.setSodium(ing.getSodiumMg()); // sodium 필드 매핑

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/api/ingredients/search")
    public List<Ingredients> searchIngredients(@RequestParam String keyword) {
        return ingredientService.searchIngredients(keyword);
    }

}
