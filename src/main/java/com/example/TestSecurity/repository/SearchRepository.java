package com.example.TestSecurity.repository;

import com.example.TestSecurity.entity.SearchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchRepository extends JpaRepository<SearchEntity, Long> {

    // 제목을 기준으로 레시피 검색
    List<SearchEntity> findByTitleContaining(String title);
}
