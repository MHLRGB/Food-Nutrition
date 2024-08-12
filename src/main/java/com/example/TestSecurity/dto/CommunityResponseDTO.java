package com.example.TestSecurity.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommunityResponseDTO {

    private int id;
    private String title;
    private String content;
    private String author;
    private String category;
    private int views;
    private int likes;
    private LocalDateTime createdDate;

}
