package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.Ingredients;
import com.example.TestSecurity.entity.Recipe;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IngredientsRepository extends JpaRepository<Ingredients, Long> {

}