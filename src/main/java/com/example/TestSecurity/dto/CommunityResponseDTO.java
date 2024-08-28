package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommunityResponseDTO {

    private long id;
    private String title;
    private String author;
    private String content;
    private String category;
    private LocalDateTime createdDate;

}
