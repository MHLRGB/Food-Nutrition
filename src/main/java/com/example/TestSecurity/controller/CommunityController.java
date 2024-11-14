package com.example.TestSecurity.controller;

import com.example.TestSecurity.dto.*;
import com.example.TestSecurity.entity.Community;
import com.example.TestSecurity.entity.Recipe;
import com.example.TestSecurity.service.CommunityService;
import com.example.TestSecurity.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final RecipeService recipeService;

    private final CommunityService communityService;

    @Autowired
    public CommunityController(RecipeService recipeService, CommunityService communityService) {
        this.recipeService = recipeService;
        this.communityService = communityService;
    }
//    @PostMapping
//    public Long createCommunity(@RequestBody CommunityRequestDTO communityRequestDTO) {
//        // 접속 중인 사용자의 이름 반환
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        RecipeRequestDTO recipeRequestDTO = communityRequestDTO.getRecipeRequestDTO();
//        if (recipeRequestDTO != null && (recipeRequestDTO.getTitle() == null || recipeRequestDTO.getIngredients() == null)) {
//            recipeRequestDTO = null;
//        }
//
//        return communityService.createCommunity(
//                communityRequestDTO.getTitle(),
//                username,
//                communityRequestDTO.getContent(),
//                communityRequestDTO.getCategory(),
//                recipeRequestDTO
//        );
//    }

    @PostMapping
    public ResponseEntity<CommunityResponseDTO> createCommunity(@RequestBody CommunityRequestDTO communityRequestDTO) {

        try {
            CommunityResponseDTO createCommunity = communityService.createCommunity(communityRequestDTO);
            return new ResponseEntity<>(createCommunity, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElementException 발생: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // 예외 원인과 스택 트레이스 출력
            System.out.println("Exception 발생: " + e.getMessage());
            e.printStackTrace();  // 스택 트레이스를 콘솔에 출력하여 디버깅 정보 확인
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityResponseDTO> updateCommunity(
            @PathVariable Long id,
            @RequestBody CommunityRequestDTO communityRequestDTO) {
        System.out.println("업데이트 커뮤니티 컨트롤러 메소드 호출");
        System.out.println("communityRequestDTO: " + communityRequestDTO);
        try {
            CommunityResponseDTO updatedCommunity = communityService.updateCommunity(id, communityRequestDTO);
            return new ResponseEntity<>(updatedCommunity, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElementException 발생: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // 예외 원인과 스택 트레이스 출력
            System.out.println("Exception 발생: " + e.getMessage());
            e.printStackTrace();  // 스택 트레이스를 콘솔에 출력하여 디버깅 정보 확인
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<CommunityResponseDTO>> getAllCommunities() {
        List<Community> communities = communityService.getAllRecipes();
        List<CommunityResponseDTO> responseDTOs = communities.stream().map(Community -> {
            CommunityResponseDTO dto = new CommunityResponseDTO();
            dto.setId(Community.getId());
            dto.setTitle(Community.getTitle());
            dto.setContent(Community.getContent());
            dto.setAuthor(Community.getAuthor());
            dto.setCategory(Community.getCategory());
            dto.setCreatedDate(Community.getCreatedDate());
            return dto;
        }).collect(Collectors.toList());

        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityResponseDTO> getCommunityById(@PathVariable long id) {
        Optional<Community> community = communityService.getCommunityById(id);

        if (community.isPresent()) {
            CommunityResponseDTO responseDTO = new CommunityResponseDTO();
            responseDTO.setId(community.get().getId());
            responseDTO.setTitle(community.get().getTitle());
            responseDTO.setContent(community.get().getContent());
            responseDTO.setAuthor(community.get().getAuthor());
            responseDTO.setCategory(community.get().getCategory());
            responseDTO.setCreatedDate(community.get().getCreatedDate());

         // responseDTO.setRecipeid(community.get().getRecipe().getId());


            // Recipe가 null이 아닌지 확인
            Recipe recipe = community.get().getRecipe();
            if (recipe != null) {
                responseDTO.setRecipeId(recipe.getRecipeId());
            } else {
                responseDTO.setRecipeId(null);
            }

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }




//    @PutMapping("/{id}")
//    public ResponseEntity<CommunityResponseDTO> updateCommunity(
//            @PathVariable int id,
//            @RequestBody CommunityRequestDTO communityRequestDTO) {
//        System.out.println("업데이트 커뮤니티 컨트롤러 메소드 호출");
//        try {
//            // 커뮤니티 정보 가져오기
//            Optional<Community> optionalCommunity = communityService.getCommunityById(id);
//
//            if (optionalCommunity.isPresent()) {
//                Community community = optionalCommunity.get();
//
//                // 기존 커뮤니티 정보 업데이트
//                community.setTitle(communityRequestDTO.getTitle());
//                community.setContent(communityRequestDTO.getContent());
//                community.setCategory(communityRequestDTO.getCategory());
//
//                // 업데이트된 커뮤니티 저장
//                communityService.saveCommunity(community);
//
//                return new ResponseEntity<>(HttpStatus.OK);
//            } else {
//                // 커뮤니티를 찾지 못한 경우 404 반환
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            }
//        } catch (Exception e) {
//            // 예외 발생 시 400 반환
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunityById(@PathVariable long id) {
        try {
            communityService.deleteCommunityById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
