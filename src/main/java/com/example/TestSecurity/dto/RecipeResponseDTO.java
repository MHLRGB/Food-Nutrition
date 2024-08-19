package com.example.TestSecurity.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeResponseDTO {

    private long id;
    private String title;
    private String author;
    private String content;
    private String category;
    private int views;
    private int likes;
    private LocalDateTime createdDate;

}
