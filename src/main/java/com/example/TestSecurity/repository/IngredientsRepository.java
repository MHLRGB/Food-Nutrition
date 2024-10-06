package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.Ingredients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IngredientsRepository extends JpaRepository<Ingredients, Long> {

    @Query("SELECT i FROM Ingredients i WHERE LOWER(i.foodName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Ingredients> findTop5ByFoodNameContainingIgnoreCase(String keyword);

}
