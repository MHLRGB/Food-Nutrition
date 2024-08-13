package com.example.TestSecurity.controller;

import com.example.TestSecurity.dto.CommunityRequestDTO;
import com.example.TestSecurity.dto.CommunityResponseDTO;
import com.example.TestSecurity.entity.CommunityRecipe;
import com.example.TestSecurity.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/communities")
public class CommunityController {

    private final CommunityService communityService;

    @Autowired
    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @PostMapping
    public ResponseEntity<CommunityResponseDTO> createCommunity(@RequestBody CommunityRequestDTO requestDTO) {
        try {
            CommunityRecipe communityRecipe = new CommunityRecipe();
            communityRecipe.setTitle(requestDTO.getTitle());
            communityRecipe.setContent(requestDTO.getContent());
            communityRecipe.setAuthor(requestDTO.getAuthor());
            communityRecipe.setCategory(requestDTO.getCategory());
            communityRecipe.setViews(0);
            CommunityRecipe savedCommunity = communityService.saveCommunity(communityRecipe);

            CommunityResponseDTO responseDTO = new CommunityResponseDTO();
            responseDTO.setId(savedCommunity.getId());
            responseDTO.setTitle(savedCommunity.getTitle());
            responseDTO.setContent(savedCommunity.getContent());
            responseDTO.setAuthor(savedCommunity.getAuthor());
            responseDTO.setCategory(savedCommunity.getCategory());
            responseDTO.setCreatedDate(savedCommunity.getCreatedDate());

            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<CommunityResponseDTO>> getAllCommunities() {
        List<CommunityRecipe> communities = communityService.getAllCommunities();
        List<CommunityResponseDTO> responseDTOs = communities.stream().map(communityRecipe -> {
            CommunityResponseDTO dto = new CommunityResponseDTO();
            dto.setId(communityRecipe.getId());
            dto.setTitle(communityRecipe.getTitle());
            dto.setContent(communityRecipe.getContent());
            dto.setAuthor(communityRecipe.getAuthor());
            dto.setCategory(communityRecipe.getCategory());
            dto.setCreatedDate(communityRecipe.getCreatedDate());
            return dto;
        }).collect(Collectors.toList());

        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityResponseDTO> getCommunityById(@PathVariable int id) {
        Optional<CommunityRecipe> community = communityService.getCommunityById(id);
        if (community.isPresent()) {
            CommunityResponseDTO responseDTO = new CommunityResponseDTO();
            responseDTO.setId(community.get().getId());
            responseDTO.setTitle(community.get().getTitle());
            responseDTO.setContent(community.get().getContent());
            responseDTO.setAuthor(community.get().getAuthor());
            responseDTO.setCategory(community.get().getCategory());
            responseDTO.setCreatedDate(community.get().getCreatedDate());

            // 조회수 증가
            communityService.incrementViews(id);

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<CommunityResponseDTO> likeRecipe(@PathVariable int id) {
        CommunityRecipe updatedCommunity = communityService.incrementLikes(id);
        if (updatedCommunity != null) {
            CommunityResponseDTO responseDTO = new CommunityResponseDTO();
            responseDTO.setId(updatedCommunity.getId());
            responseDTO.setTitle(updatedCommunity.getTitle());
            responseDTO.setContent(updatedCommunity.getContent());
            responseDTO.setAuthor(updatedCommunity.getAuthor());
            responseDTO.setCategory(updatedCommunity.getCategory());
            responseDTO.setCreatedDate(updatedCommunity.getCreatedDate());
            responseDTO.setViews(updatedCommunity.getViews());
            responseDTO.setLikes(updatedCommunity.getLikes());

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunityById(@PathVariable int id) {
        try {
            communityService.deleteCommunityById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/top-popular-recipe")
    public ResponseEntity<List<CommunityResponseDTO>> getTop3PopularRecipes() {
        List<CommunityRecipe> recipes = communityService.getTop3PopularRecipes();
        List<CommunityResponseDTO> responseDTOs = recipes.stream()
                .map(recipe -> {
                    CommunityResponseDTO dto = new CommunityResponseDTO();
                    dto.setId(recipe.getId());
                    dto.setTitle(recipe.getTitle());
                    dto.setContent(recipe.getContent());
                    dto.setAuthor(recipe.getAuthor());
                    dto.setCategory(recipe.getCategory());
                    dto.setCreatedDate(recipe.getCreatedDate());
                    return dto;
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }
}
