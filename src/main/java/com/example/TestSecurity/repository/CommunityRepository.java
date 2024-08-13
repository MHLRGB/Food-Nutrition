package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.CommunityRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommunityRepository extends JpaRepository<CommunityRecipe, Integer> {
    @Query("SELECT c FROM CommunityRecipe c ORDER BY c.views DESC")
    List<CommunityRecipe> findTop3ByViews();
}