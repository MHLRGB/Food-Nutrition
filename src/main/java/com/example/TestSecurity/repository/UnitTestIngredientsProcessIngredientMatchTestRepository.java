//package com.example.TestSecurity.repository;
//
//import com.example.TestSecurity.entity.UnitTestIngredientsProcessIngredientMatchTest;
//import com.example.TestSecurity.entity.UnitTestIngredientsProcessIngredientMatchTest.UnitTestIngredientsProcessIngredientMatchTestId;
//import jakarta.transaction.Transactional;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
//
//import java.util.List;
//
//public interface UnitTestIngredientsProcessIngredientMatchTestRepository
//        extends JpaRepository<UnitTestIngredientsProcessIngredientMatchTest, UnitTestIngredientsProcessIngredientMatchTestId> {
//
//    // 특정 레시피 ID에 해당하는 모든 재료 찾기
//    List<UnitTestIngredientsProcessIngredientMatchTest> findById_RecipeId(Long recipeId);
//
//    // 특정 레시피 ID에 해당하는 모든 재료 삭제
//    @Modifying
//    @Transactional
//    void deleteById_RecipeId(Long recipeId);
//
//    // 특정 레시피 ID와 섹션에 해당하는 재료 찾기
//    List<UnitTestIngredientsProcessIngredientMatchTest> findById_RecipeIdAndId_Section(Long recipeId, String section);
//
//    // 특정 레시피 ID와 재료 ID에 해당하는 재료 찾기
//    List<UnitTestIngredientsProcessIngredientMatchTest> findById_RecipeIdAndId_IngredientId(Long recipeId, Long ingredientId);
//}
