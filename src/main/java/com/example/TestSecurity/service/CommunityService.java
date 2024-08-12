// CommunityService.java
package com.example.TestSecurity.service;

import com.example.TestSecurity.entity.CommunityRecipe;
import com.example.TestSecurity.repository.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;

    @Autowired
    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    public CommunityRecipe saveCommunity(CommunityRecipe communityRecipe) {
        return communityRepository.save(communityRecipe);
    }

    public List<CommunityRecipe> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Optional<CommunityRecipe> getCommunityById(int id) {
        return communityRepository.findById(id);
    }

    public void deleteCommunityById(int id) {
        communityRepository.deleteById(id);
    }

    public CommunityRecipe incrementViews(int id) {
        Optional<CommunityRecipe> optionalCommunity = communityRepository.findById(id);
        if (optionalCommunity.isPresent()) {
            CommunityRecipe community = optionalCommunity.get();
            community.setViews(community.getViews() + 1);
            return communityRepository.save(community);
        }
        return null;
    }

    public CommunityRecipe incrementLikes(int id) {
        Optional<CommunityRecipe> optionalCommunity = communityRepository.findById(id);
        if (optionalCommunity.isPresent()) {
            CommunityRecipe community = optionalCommunity.get();
            community.setLikes(community.getLikes() + 1);
            return communityRepository.save(community);
        }
        return null;
    }
}
