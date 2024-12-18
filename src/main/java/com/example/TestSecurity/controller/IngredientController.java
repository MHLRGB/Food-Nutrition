package com.example.TestSecurity.controller;

import com.example.TestSecurity.dto.CommunityResponseDTO;
import com.example.TestSecurity.dto.IngredientResponseDTO;
import com.example.TestSecurity.dto.IngredientSearchDTO;
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
            responseDTO.setIngredientsID(ing.getIngredientId()); // id 필드 매핑
            responseDTO.setIngredientName(ing.getIngredientName()); // name 필드 매핑
            responseDTO.setIngredientGroup(ing.getIngredientGroup()); // name 필드 매핑
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

    @GetMapping("/search")
    public List<IngredientSearchDTO> searchIngredients(@RequestParam String keyword) {
        return ingredientService.searchIngredients(keyword);
    }

}
