//package com.example.TestSecurity.service;
//
//import com.example.TestSecurity.dto.*;
//import com.example.TestSecurity.entity.Community;
//import com.example.TestSecurity.entity.Ingredients;
//import com.example.TestSecurity.entity.Recipe;
//import com.example.TestSecurity.entity.RecipeIngredients;
//import com.example.TestSecurity.repository.CommunityRepository;
//import com.example.TestSecurity.repository.IngredientsRepository;
//import com.example.TestSecurity.repository.RecipeIngredientsRepository;
//import com.example.TestSecurity.repository.RecipeRepository;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.NoSuchElementException;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class CommunityService {
//
//    private final RecipeRepository recipeRepository;
//
//    private final IngredientsRepository ingredientsRepository;
//
//    private final RecipeIngredientsRepository recipeIngredientsRepository;
//
//    private final CommunityRepository communityRepository;
//
//    @Autowired
//    private RecipeService recipeService;
//
//    @Autowired
//    public CommunityService(RecipeRepository recipeRepository, IngredientsRepository ingredientsRepository, RecipeIngredientsRepository recipeIngredientsRepository, CommunityRepository communityRepository) {
//        this.recipeRepository = recipeRepository;
//        this.ingredientsRepository = ingredientsRepository;
//        this.recipeIngredientsRepository = recipeIngredientsRepository;
//        this.communityRepository = communityRepository;
//    }
//
////    public Long createCommunity(String title, String author, String content, String category, RecipeRequestDTO recipeRequestDTO) {
////
////        Recipe savedRecipe = null;
////
////        if (recipeRequestDTO != null) {
////            savedRecipe = recipeService.createRecipeWithIngredients(
////                    recipeRequestDTO.getTitle(),
////                    author,
////                    recipeRequestDTO.getCategory(),
////                    recipeRequestDTO.getIngredients()
////            );
////        }
////
//////        Recipe savedRecipe = recipeService.createRecipeWithIngredients(recipeRequestDTO.getTitle(), recipeRequestDTO.getCategory(),recipeRequestDTO.getTitle(), recipeRequestDTO.getIngredients());
////
////        Community community = new Community();
////        community.setTitle(title);
////        community.setAuthor(author);
////        community.setContent(content);
////        community.setCategory(category);
////        community.setRecipe(savedRecipe);
////
////        Community savedcommunity = communityRepository.save(community);
////
////
////        return savedcommunity.getId();
////    }
//
//    public CommunityResponseDTO createCommunity(CommunityRequestDTO communityRequestDTO) {
//
//        // 접속 중인 사용자 이름 반환
//        String author = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        // Community 객체 생성
//        Community community = new Community();
//        community.setTitle(communityRequestDTO.getTitle());
//        community.setAuthor(author);
//        community.setContent(communityRequestDTO.getContent());
//        community.setCategory(communityRequestDTO.getCategory());
//
//        Recipe savedRecipe = null; // 저장된 레시피 초기화
//
//        // RecipeRequestDTO가 존재하는 경우에만 레시피 처리
//        if (communityRequestDTO.getRecipeRequestDTO() != null) {
//            RecipeRequestDTO recipeRequestDTO = communityRequestDTO.getRecipeRequestDTO();
//
//            // 레시피를 업데이트하거나 새로 생성하는 로직
//            savedRecipe = recipeService.updateOrCreateRecipe(community, recipeRequestDTO);
//            // community에 recipe를 설정
//            community.setRecipe(savedRecipe);
//        }
//
//        // Community 저장
//        Community savedCommunity = communityRepository.save(community);
//
//        // 사용자에게 반환할 DTO 설정
//        CommunityResponseDTO responseDTO = new CommunityResponseDTO();
//        responseDTO.setTitle(savedCommunity.getTitle());
//        responseDTO.setContent(savedCommunity.getContent());
//        responseDTO.setCategory(savedCommunity.getCategory());
//
//        // 레시피가 존재하는 경우에만 recipeId 설정
//        if (savedCommunity.getRecipe() != null) {
//            responseDTO.setRecipeId(savedCommunity.getRecipe().getRecipeId());
//        } else {
//            responseDTO.setRecipeId(null);
//        }
//
//        return responseDTO;
//    }
//
//
//    @Transactional
//    public CommunityResponseDTO updateCommunity(Long id, CommunityRequestDTO communityRequestDTO) {
//        System.out.println("업데이트 커뮤니티 서비스 메소드 호출");
//        // 커뮤니티 정보 가져오기
//        Community community = communityRepository.findById(id)
//                .orElseThrow(() -> new NoSuchElementException("Community not found"));
//
//        // 기존 커뮤니티 정보 업데이트
//        community.setTitle(communityRequestDTO.getTitle());
//        community.setContent(communityRequestDTO.getContent());
//        community.setCategory(communityRequestDTO.getCategory());
//
//        // Recipe 정보가 있는 경우 처리
//        RecipeRequestDTO recipeRequestDTO = communityRequestDTO.getRecipeRequestDTO();
//        if (recipeRequestDTO != null && recipeRequestDTO.getIngredients() != null) {
//            Recipe updatedRecipe = recipeService.updateOrCreateRecipe(community, recipeRequestDTO);
//            community.setRecipe(updatedRecipe);
//        }
//
//        // 업데이트된 커뮤니티 저장
//        Community savedcommunity = communityRepository.save(community);
//
//        // 사용자 응답 DTO 설정
//        CommunityResponseDTO responseDTO = new CommunityResponseDTO();
//        responseDTO.setTitle(savedcommunity.getTitle());
//        responseDTO.setContent(savedcommunity.getContent());
//        responseDTO.setCategory(savedcommunity.getCategory());
//        responseDTO.setRecipeId(savedcommunity.getRecipe().getRecipeId());
//
//        return responseDTO;
//    }
//
////    public Long updateCommunity(Long id, String title, String author, String content, String category, RecipeRequestDTO recipeRequestDTO) {
////
////        Recipe savedRecipe = null;
////
////        if (recipeRequestDTO != null) {
////            savedRecipe = recipeService.updateRecipeWithIngredients(
////                    id,
////                    recipeRequestDTO.getTitle(),
////                    author,
////                    recipeRequestDTO.getCategory(),
////                    recipeRequestDTO.getIngredients()
////            );
////        }
////
//////        Recipe savedRecipe = recipeService.createRecipeWithIngredients(recipeRequestDTO.getTitle(), recipeRequestDTO.getCategory(),recipeRequestDTO.getTitle(), recipeRequestDTO.getIngredients());
////
////        Community community = new Community();
////        community.setTitle(title);
////        community.setAuthor(author);
////        community.setContent(content);
////        community.setCategory(category);
////        community.setRecipe(savedRecipe);
////
////        Community savedcommunity = communityRepository.save(community);
////
////
////        return savedcommunity.getId();
////    }
//
//    public void saveCommunity(Community community) {
//        communityRepository.save(community);
//    }
//
//    public void deleteCommunityById(long id) {
//        communityRepository.deleteById(id);
//    }
//
//    public List<Community> getAllRecipes() {
//        return communityRepository.findAll();
//    }
//
//    public Optional<Community> getCommunityById(long id) {
//        return communityRepository.findById(id);
//    }
//
//
//    public Optional<Ingredients> getIngredientById(Long id) {
//        return ingredientsRepository.findById(id);
//    }
//
//    public Recipe incrementViews(long id) {
//        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
//        if (optionalRecipe.isPresent()) {
//            Recipe recipe = optionalRecipe.get();
//            return recipeRepository.save(recipe);
//        }
//        return null;
//    }
//
////    public List<Recipe> getTop3PopularRecipes() {
////        Pageable pageable = PageRequest.of(0, 3);
////        return recipeRepository.findTop3ByViews(pageable);
////    }
//
//}
