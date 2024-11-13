package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.MunTestExRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface Mun_Test_ExRecipeRepository extends JpaRepository<MunTestExRecipe, Integer> {

//      @Query("SELECT r.cookingIngredientsContent FROM MunTestExRecipe r") // YourEntity를 실제 엔티티 이름으로 변경
//      List<String> findAllIngredientContents();
}
