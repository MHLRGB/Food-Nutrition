package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.CommunityRecipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRepository extends JpaRepository<CommunityRecipe, Integer> {

}