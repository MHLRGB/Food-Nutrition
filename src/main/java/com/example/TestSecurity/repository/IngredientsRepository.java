package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.Ingredients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IngredientsRepository extends JpaRepository<Ingredients, Long> {

//    @Query("SELECT i FROM Ingredients i WHERE LOWER(i.foodName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
//    List<Ingredients> findTop5ByFoodNameContainingIgnoreCase(String keyword);

      List<Ingredients> findTop5ByFoodNameContainingIgnoreCase(String keyword);

      // 이름이 주어진 패턴과 일치하는 재료를 찾는 메서드
      Optional<Ingredients> findByFoodNameLike(String name);

}
