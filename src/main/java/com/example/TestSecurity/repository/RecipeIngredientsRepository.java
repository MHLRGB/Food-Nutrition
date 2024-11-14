package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.RecipeIngredients;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeIngredientsRepository extends JpaRepository<RecipeIngredients, RecipeIngredients.RecipeIngredientsId> {

    List<RecipeIngredients> findById_RecipeId(Long recipe_id);

    @Query("SELECT MAX(ri.id.id) FROM RecipeIngredients ri")
    Long findMaxId();

    // 특정 레시피 ID에 해당하는 모든 재료 삭제
    @Modifying
    @Transactional
    void deleteById_RecipeId(Long recipe_id);
}
