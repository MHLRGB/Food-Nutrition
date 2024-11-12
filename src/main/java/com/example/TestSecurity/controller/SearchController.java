package com.example.TestSecurity.controller;

import com.example.TestSecurity.entity.SearchEntity;
import com.example.TestSecurity.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")  // API 경로가 "/api/search"로 설정
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/recipes")  // "/recipes"는 "/api/search/recipes"로 매핑됨
    public List<SearchEntity> searchRecipes(@RequestParam("title") String title) {
        return searchService.findRecipesByTitle(title);
    }
}
