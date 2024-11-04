package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.MunTestExRecipe;
import com.example.TestSecurity.entity.TestCrawlingRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TestCrawlingRecipeRepository extends JpaRepository<TestCrawlingRecipe, Integer> {
    @Query("SELECT r.ingredientsContent FROM TestCrawlingRecipe r") // YourEntity를 실제 엔티티 이름으로 변경
    List<String> findAllIngredientContents();
}
