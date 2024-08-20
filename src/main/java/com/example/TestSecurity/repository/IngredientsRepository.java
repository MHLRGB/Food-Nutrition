package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.Ingredients;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientsRepository extends JpaRepository<Ingredients, Long> {
}
