package com.example.TestSecurity.service;

import com.example.TestSecurity.entity.SearchEntity;
import com.example.TestSecurity.repository.SearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    @Autowired
    private SearchRepository searchRepository;

    // 제목을 기준으로 레시피 검색
    public List<SearchEntity> findRecipesByTitle(String title) {
        return searchRepository.findByTitleContaining(title);
    }
}
